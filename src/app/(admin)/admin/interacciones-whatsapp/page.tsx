import { fetchWhatsAppInteractionsAdmin } from "@/lib/supabase/queries/admin-whatsapp-interactions";

function formatInteractionDate(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

export default async function WhatsAppInteractionsAdminPage() {
  const interactions = await fetchWhatsAppInteractionsAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">
          Interacciones WhatsApp
        </h1>
        <p className="mt-1 text-sm text-muted">
          Trazabilidad de formularios de contacto e interés en producto.
        </p>
      </div>

      {interactions.length === 0 ? (
        <div className="rounded-xl border border-secondary bg-white p-8 text-sm text-muted">
          Aún no hay interacciones registradas.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-secondary bg-white">
          <table className="min-w-full divide-y divide-secondary text-sm">
            <thead className="bg-secondary/20">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-text">Fecha</th>
                <th className="px-4 py-3 text-left font-semibold text-text">Tipo</th>
                <th className="px-4 py-3 text-left font-semibold text-text">Canal</th>
                <th className="px-4 py-3 text-left font-semibold text-text">Página</th>
                <th className="px-4 py-3 text-left font-semibold text-text">Producto</th>
                <th className="px-4 py-3 text-left font-semibold text-text">Cliente</th>
                <th className="px-4 py-3 text-left font-semibold text-text">Teléfono</th>
                <th className="px-4 py-3 text-left font-semibold text-text">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/60">
              {interactions.map((interaction) => (
                <tr key={interaction.id} className="align-top">
                  <td className="px-4 py-3 text-muted">
                    {formatInteractionDate(interaction.created_at)}
                  </td>
                  <td className="px-4 py-3 text-text">
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                      {interaction.interaction_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text">{interaction.channel}</td>
                  <td className="max-w-[260px] px-4 py-3 text-muted">
                    {interaction.page_path ?? "-"}
                  </td>
                  <td className="max-w-[220px] px-4 py-3 text-text">
                    {interaction.product_name ?? "-"}
                  </td>
                  <td className="max-w-[220px] px-4 py-3 text-text">
                    {interaction.customer_name ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-text">
                    {interaction.customer_phone ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {interaction.customer_email ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
