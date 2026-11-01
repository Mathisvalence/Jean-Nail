import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Les images sont redimensionnées par le CDN de Sanity (voir src/sanity/image-loader.ts).
    loader: 'custom',
    loaderFile: './src/sanity/image-loader.ts',
  },
}

export default nextConfig
