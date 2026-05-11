import defaultCatImage from '../../assets/images/cat_01.jpg'

const IMAGE_PREFIX = '/catAI/assets/images/'

export function resolveCatImageUrl(imageUrl) {
  if (!imageUrl) {
    return defaultCatImage
  }

  if (imageUrl.startsWith('http')) {
    return imageUrl
  }

  if (imageUrl.startsWith('/')) {
    return imageUrl
  }

  return `${IMAGE_PREFIX}${imageUrl}`
}

export { defaultCatImage }
