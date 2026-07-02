import { toPersianDigits } from "../../lib/persian-numerals";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface Rule {
  id: string;
  name: string;
  termMonths: number;
  feePercentage: number;
}

interface InstallmentTabsProps {
  rules: Rule[];
  selectedRuleId: string;
  onSelect: (ruleId: string) => void;
}

/**
 * InstallmentTabs — Dynamic tenure selection tabs from DB.
 * Each active installment_rules row = one tab.
 */
export function InstallmentTabs({ rules, selectedRuleId, onSelect }: InstallmentTabsProps) {
  return (
    <div>
      <p className="mb-3 text-xs font-medium text-text-secondary">مدت اقساط</p>
      <Tabs value={selectedRuleId} onValueChange={onSelect}>
        <TabsList
          className="grid w-full rounded-xl bg-surface-secondary p-1"
          style={{ gridTemplateColumns: `repeat(${rules.length}, 1fr)` }}
        >
          {rules.map((rule) => (
            <TabsTrigger
              key={rule.id}
              value={rule.id}
              className="rounded-lg text-xs font-semibold data-[state=active]:bg-surface data-[state=active]:shadow-sm"
            >
              {toPersianDigits(String(rule.termMonths))} ماهه
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
