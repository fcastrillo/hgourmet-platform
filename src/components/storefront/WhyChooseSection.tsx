interface TrustCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const TRUST_CARDS: TrustCard[] = [
  {
    icon: (
      <svg
        className="h-8 w-8 text-primary"
        width={32}
        height={32}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
        />
      </svg>
    ),
    title: "Productos selectos",
    description:
      "Trabajamos con las mejores marcas internacionales de repostería.",
  },
  {
    icon: (
      <svg
        className="h-8 w-8 text-primary"
        width={32}
        height={32}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    ),
    title: "Atención personalizada",
    description:
      "Te asesoramos para que encuentres exactamente lo que necesitas.",
  },
  {
    icon: (
      <svg
        className="h-8 w-8 text-primary"
        width={32}
        height={32}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
        />
      </svg>
    ),
    title: "Envío en Mérida",
    description:
      "Recibe tus pedidos cómodamente en toda la zona metropolitana.",
  },
];

export function WhyChooseSection() {
  return (
    <section className="py-16">
      <div className="mb-10 text-center">
        <h2 className="font-heading text-3xl font-bold text-text">
          ¿Por qué <span className="text-primary">elegirnos</span>?
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {TRUST_CARDS.map((card) => (
          <div
            key={card.title}
            className="flex flex-col items-center rounded-2xl border border-secondary bg-white px-6 py-8 text-center shadow-sm"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              {card.icon}
            </div>
            <h3 className="font-heading text-base font-semibold text-text">
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
