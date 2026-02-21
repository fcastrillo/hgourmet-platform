interface Props { title: string }

const AdminPlaceholder = ({ title }: Props) => (
  <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border shadow-sm gap-3">
    <p className="text-2xl font-bold text-chocolate">{title}</p>
    <p className="text-muted-foreground text-sm">Próximamente</p>
  </div>
);

export default AdminPlaceholder;
