import { Card } from "@/components/ui/card";

interface DemoAccount {
  email: string;
  role: string;
  roleColor: string;
}

const demoAccounts: DemoAccount[] = [
  {
    email: "john@builder.com",
    role: "Worker",
    roleColor: "text-green-600",
  },
  {
    email: "mike@client.com",
    role: "Client",
    roleColor: "text-primary",
  },
  {
    email: "admin@builder.com",
    role: "Admin",
    roleColor: "text-destructive",
  },
  {
    email: "tom@sitemanager.com",
    role: "Site Manager",
    roleColor: "text-purple-600",
  },
];

export default function DemoAccounts() {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">
        Demo accounts (password: any):
      </p>

      <div className="space-y-2">
        {demoAccounts.map((account, index) => (
          <Card
            key={index}
            className="p-3 bg-secondary border border-border hover:bg-accent transition-colors cursor-pointer"
          >
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-foreground">
                {account.email}
              </span>
              <span className={`text-xs font-medium ${account.roleColor}`}>
                {account.role}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
