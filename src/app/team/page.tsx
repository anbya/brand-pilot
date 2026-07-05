import { AppFrame, Card, PrimaryButton, SectionTitle, Shell, StatusBadge, Table } from "@/components/brandpilot";
import { teamMembers } from "@/lib/mock-data";

export default function TeamPage() {
  return (
    <Shell
      eyebrow="Team Collaboration"
      title="Team members and roles."
      description="Halaman ini mengikuti blok team pada referensi."
      actions={<PrimaryButton href="/settings">Invite Member</PrimaryButton>}
    >
      <AppFrame title="Team Workspace">
        <Card>
          <SectionTitle title="Team Members" description="Manage collaborators and permissions." />
          <Table
            headers={["Name", "Role", "Status"]}
            rows={teamMembers.map((member) => [
              member.name,
              member.role,
              <StatusBadge key={member.name} status={member.status === "online" ? "active" : "draft"} />,
            ])}
          />
        </Card>
      </AppFrame>
    </Shell>
  );
}
