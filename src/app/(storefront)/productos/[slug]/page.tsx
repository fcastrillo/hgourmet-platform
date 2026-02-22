import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchProductBySlug } from "@/lib/supabase/queries/products";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";
import { WhatsAppCTA } from "@/components/storefront/WhatsAppCTA";
import { formatPrice } from "@/lib/utils";

interface ProductDetailPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({
    params,
}: ProductDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await fetchProductBySlug(slug);

    if (!product) {
        return { title: "Producto no encontrado | HGourmet" };
    }

    const description =
        product.description ??
        `Descubre ${product.name} en HGourmet — Insumos Gourmet para Repostería en Mérida.`;

    return {
        title: `${product.name} | HGourmet`,
        description,
        openGraph: {
            title: `${product.name} | HGourmet`,
            description,
            ...(product.image_url && {
                images: [
                    {
                        url: product.image_url,
                        alt: product.name,
                    },
                ],
            }),
        },
    };
}

export default async function ProductDetailPage({
    params,
}: ProductDetailPageProps) {
    const { slug } = await params;
    const product = await fetchProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const breadcrumbItems = [
        { label: "Inicio", href: "/" },
        {
            label: product.categories.name,
            href: `/categorias/${product.categories.slug}`,
        },
        { label: product.name },
    ];

    return (
        <section className="mx-auto max-w-5xl px-4 py-8">
            <Breadcrumb items={breadcrumbItems} />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Product Image */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-secondary bg-secondary/20">
                    {product.image_url ? (
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted">
                            Sin imagen disponible
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                    {/* Availability badge */}
                    <div className="mb-3">
                        {product.is_available ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                                <span
                                    className="h-1.5 w-1.5 rounded-full bg-success"
                                    aria-hidden="true"
                                />
                                Disponible
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-error/10 px-3 py-1 text-xs font-semibold text-error">
                                <span
                                    className="h-1.5 w-1.5 rounded-full bg-error"
                                    aria-hidden="true"
                                />
                                Agotado
                            </span>
                        )}
                    </div>

                    {/* Name */}
                    <h1 className="font-heading text-2xl font-bold text-text sm:text-3xl">
                        {product.name}
                    </h1>

                    {/* Category link */}
                    <Link
                        href={`/categorias/${product.categories.slug}`}
                        className="mt-1 text-sm text-muted transition-colors hover:text-primary"
                    >
                        {product.categories.name}
                    </Link>

                    {/* Price */}
                    <p className="mt-4 font-heading text-3xl font-bold text-primary">
                        {formatPrice(product.price)}
                    </p>

                    {/* Description */}
                    {product.description && (
                        <div className="mt-5 border-t border-secondary/50 pt-5">
                            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
                                Descripción
                            </h2>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-text/80">
                                {product.description}
                            </p>
                        </div>
                    )}

                    {/* WhatsApp CTA */}
                    <WhatsAppCTA
                        productName={product.name}
                        isAvailable={product.is_available}
                    />

                    {/* SKU */}
                    {product.sku && (
                        <p className="mt-4 text-xs text-muted">SKU: {product.sku}</p>
                    )}
                </div>
            </div>
        </section>
    );
}
