import type { DirectUploadPayload } from '@octoworkers/com'
import type { AppBindings } from '../../com/bindings'
import { cloudflareAccountId, imagesConfigured } from '../../com/env'

type CloudflareResponse<T> = {
  success: boolean
  errors?: Array<{ message: string }>
  result: T
}

type DirectUploadResponse = {
  id: string
  uploadURL: string
}

type ImageDetails = {
  id: string
  variants?: string[]
}

function authHeaders(env: AppBindings) {
  return {
    authorization: `Bearer ${env.CLOUDFLARE_IMAGES_API_TOKEN}`,
    'content-type': 'application/json',
  }
}

export async function createDirectUpload(env: AppBindings, input: { title: string; alt?: string }) {
  if (!imagesConfigured(env)) {
    throw new Error('Cloudflare Images is not configured')
  }

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId(env)}/images/v2/direct_upload`, {
    method: 'POST',
    headers: authHeaders(env),
    body: JSON.stringify({
      requireSignedURLs: false,
      metadata: {
        title: input.title,
        alt: input.alt ?? '',
      },
    }),
  })

  const payload = (await response.json()) as CloudflareResponse<DirectUploadResponse>

  if (!response.ok || !payload.success) {
    throw new Error(payload.errors?.[0]?.message ?? 'Direct upload creation failed')
  }

  return {
    imageId: payload.result.id,
    uploadURL: payload.result.uploadURL,
  } satisfies DirectUploadPayload
}

export async function fetchImageDetails(env: AppBindings, imageId: string) {
  if (!imagesConfigured(env)) {
    throw new Error('Cloudflare Images is not configured')
  }

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId(env)}/images/v1/${imageId}`, {
    headers: authHeaders(env),
  })

  const payload = (await response.json()) as CloudflareResponse<ImageDetails>

  if (!response.ok || !payload.success) {
    throw new Error(payload.errors?.[0]?.message ?? 'Image lookup failed')
  }

  const previewUrl =
    payload.result.variants?.[0] ??
    (env.CLOUDFLARE_IMAGES_DELIVERY_HASH ? `https://imagedelivery.net/${env.CLOUDFLARE_IMAGES_DELIVERY_HASH}/${imageId}/public` : null)

  return {
    imageId,
    status: previewUrl ? 'ready' : 'draft',
    previewUrl,
    deliveryUrl: previewUrl,
  }
}

export async function deleteImage(env: AppBindings, imageId: string) {
  if (!imagesConfigured(env)) {
    throw new Error('Cloudflare Images is not configured')
  }

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId(env)}/images/v1/${imageId}`, {
    method: 'DELETE',
    headers: authHeaders(env),
  })

  if (!response.ok) {
    throw new Error('Cloudflare Images deletion failed')
  }
}
