import {flattenConnection, Money} from '@shopify/hydrogen';
import {useState, useEffect} from 'react';

const GENERAL_LABELS = {
  TITLE: 'Purchase Options',
  ONE_TIME_PURCHASE: 'One Time',
  SUBSCRIBE: 'Subscribe and Save',
};

const PURCHASE_TYPE_LABELS = {
  ONE_TIME: 'one-time',
  SUBSCRIPTION: 'subscription',
};

export function PlanPicker({
  selectedVariant,
  selectedSellingPlan,
  onPlanChange,
}) {
  const [purchaseType, setPurchaseType] = useState(
    PURCHASE_TYPE_LABELS.ONE_TIME,
  );
  const sellingPlanAllocations = flattenConnection(
    selectedVariant.sellingPlanAllocations,
  );
  const [sellingPlanAllocation, setSellingPlanAllocation] = useState(null);

  const defaultSellingPlanAllocation = selectedSellingPlan
    ? sellingPlanAllocations.find(
        (spa) =>
          spa.sellingPlan.id.toString() === selectedSellingPlan.id.toString(),
      )
    : sellingPlanAllocations[0];

  useEffect(() => {
    if (purchaseType === PURCHASE_TYPE_LABELS.SUBSCRIPTION) {
      setSellingPlanAllocation(defaultSellingPlanAllocation);
    } else {
      setSellingPlanAllocation(null);
    }
  }, [purchaseType, sellingPlanAllocations]);

  useEffect(() => {
    onPlanChange && onPlanChange(sellingPlanAllocation?.sellingPlan);
  }, [sellingPlanAllocation]);

  const onSellingPlanAllocationSelect = (sellingPlanId) => {
    const sellingPlanAllocation = sellingPlanAllocations.find(
      (spa) => spa.sellingPlan.id.toString() === sellingPlanId,
    );
    if (!sellingPlanAllocation) return;
    setSellingPlanAllocation(sellingPlanAllocation);
  };

  if (!sellingPlanAllocations.length) {
    return null;
  }

  return (
    <fieldset
      className="p-0 m-0 flex flex-col max-w-sm"
      role="radiogroup"
      aria-labelledby="plan-picker-legend"
    >
      <legend id="plan-picker-legend">{GENERAL_LABELS.TITLE}</legend>
      <label className="flex flex-wrap gap-1 items-center cursor-pointer">
        <input
          type="radio"
          name="plan-picker-group"
          checked={purchaseType === PURCHASE_TYPE_LABELS.ONE_TIME}
          value={PURCHASE_TYPE_LABELS.ONE_TIME}
          onChange={() => setPurchaseType(PURCHASE_TYPE_LABELS.ONE_TIME)}
        />
        {GENERAL_LABELS.ONE_TIME_PURCHASE} -{' '}
        {<Money data={selectedVariant.price} />}
      </label>
      <label className="flex flex-wrap gap-1 items-center cursor-pointer">
        <input
          type="radio"
          name="plan-picker-group"
          checked={purchaseType === PURCHASE_TYPE_LABELS.SUBSCRIPTION}
          value={PURCHASE_TYPE_LABELS.SUBSCRIPTION}
          onChange={() => setPurchaseType(PURCHASE_TYPE_LABELS.SUBSCRIPTION)}
        />
        {GENERAL_LABELS.SUBSCRIBE}{' '}
        {/* TODO: Add handling of each price adjustment type */}
        {
          defaultSellingPlanAllocation.sellingPlan.priceAdjustments[0]
            .adjustmentValue.adjustmentPercentage
        }
        % - {<Money data={defaultSellingPlanAllocation.checkoutChargeAmount} />}
        {purchaseType === PURCHASE_TYPE_LABELS.SUBSCRIPTION ? (
          <div className="pl-4 w-full">
            <select
              className="block w-full"
              name="selling_plan"
              value={sellingPlanAllocation?.id}
              onChange={(e) => onSellingPlanAllocationSelect(e.target.value)}
            >
              {sellingPlanAllocations.map((spa) => (
                <option key={spa.id} value={spa.sellingPlan.id}>
                  {spa.sellingPlan.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </label>
    </fieldset>
  );
}
