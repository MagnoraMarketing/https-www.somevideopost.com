import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Sidebar } from "@/components/layout/sidebar";
import { createClient } from "@/lib/supabase/server";
import { getCurrency } from "@/lib/locale-server";
import { CurrencyProvider } from "@/components/pricing/currency-context";
import type { SocialAccount } from "@/types/database";
import type { Locale } from "@/lib/i18n";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("locale")?.value;
  const locale = (["da","en","es","de"].includes(rawLocale ?? "") ? rawLocale : "da") as Locale;

  const currency = await getCurrency();

  const { data: accounts } = await supabase
    .from("social_accounts")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        accounts={(accounts ?? []) as SocialAccount[]}
        userEmail={data.user.email}
        locale={locale}
      />
      <div className="flex flex-1 flex-col overflow-y-auto bg-[#FAF7F2] pt-14 pb-16 md:pt-0 md:pb-0">
        {/* Prices inside the app are shown in the account's own currency. */}
        <CurrencyProvider currency={currency}>{children}</CurrencyProvider>
      </div>
    </div>
  );
}
