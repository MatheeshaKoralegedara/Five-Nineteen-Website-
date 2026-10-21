import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { r2 } from "@/lib/r2";
import { requireAdmin } from "@/lib/auth";

const Body = z.object({
  fileName: z.string().min(1).max(200),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  gallerySlug: z.string().regex(/^[a-z0-9-]+$/),
});

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return new Response("Invalid request", { status: 400 });
  }
  const { fileName, contentType, gallerySlug } = parsed.data;

  const safeName = fileName.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const key = `${gallerySlug}/${crypto.randomUUID()}-${safeName}`;

  const url = await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 300 },
  );

  return Response.json({ url, key });
}  