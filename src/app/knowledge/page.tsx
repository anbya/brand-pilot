import { AppFrame, Card, PrimaryButton, SectionTitle, Shell, Table } from "@/components/brandpilot";
import { knowledgeBase } from "@/lib/mock-data";

export default function KnowledgePage() {
  return (
    <Shell
      eyebrow="Knowledge Base"
      title="Source files and prompts."
      description="Halaman ini meniru daftar knowledge base pada referensi."
      actions={<PrimaryButton href="/brain">Upload File</PrimaryButton>}
    >
      <AppFrame title="Knowledge Base">
        <Card>
          <SectionTitle title="Knowledge Files" description="Brand docs, prompt, menu, and assets." />
          <Table
            headers={["Name", "Type", "Updated"]}
            rows={knowledgeBase.map((file) => [file.name, file.type, file.updated])}
          />
        </Card>
      </AppFrame>
    </Shell>
  );
}
