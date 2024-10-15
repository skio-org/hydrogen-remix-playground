import {Link} from '@remix-run/react';
import {VariantSelector} from '@shopify/hydrogen';
import {useState} from 'react';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {PlanPicker} from './PlanPicker';

/**
 * @param {{
 *   product: ProductFragment;
 *   selectedVariant: ProductFragment['selectedVariant'];
 *   variants: Array<ProductVariantFragment>;
 * }}
 */
export function ProductForm({product, selectedVariant, variants}) {
  const {open} = useAside();

  const [selectedSellingPlan, setSelectedSellingPlan] = useState(null);

  return (
    <div className="product-form">
      <VariantSelector
        handle={product.handle}
        options={product.options.filter((option) => option.values.length > 1)}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <br />
      {/* SKIO */}
      <PlanPicker
        selectedVariant={selectedVariant}
        selectedSellingPlan={selectedSellingPlan}
        onPlanChange={(sp) => setSelectedSellingPlan(sp)}
      />
      {/* END: SKIO */}
      <br />
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  ...(selectedSellingPlan && {
                    sellingPlanId: selectedSellingPlan.id,
                  }),
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

/**
 * @param {{option: VariantOption}}
 */
function ProductOptions({option}) {
  return (
    <div className="product-options" key={option.name}>
      <h5>{option.name}</h5>
      <div className="product-options-grid">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className="product-options-item"
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                border: isActive ? '1px solid black' : '1px solid transparent',
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
      <br />
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen').VariantOption} VariantOption */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
