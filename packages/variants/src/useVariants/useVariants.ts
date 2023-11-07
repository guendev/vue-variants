import { computed, toValue } from 'vue'
import type { OptionsOf, UseVariants, Variants } from './types'

export function isBooleanVariant<V extends Variants>(
  variants: V,
  name: keyof V,
) {
  if (typeof variants[name] !== 'object')
    return false
  return ['true', 'false'].some(key =>
    Object.keys(variants[name]).includes(key),
  )
}

export function getSelected<V extends Variants>(
  variants: V,
  variant: keyof V,
  signature: OptionsOf<V>,
) {
  return isBooleanVariant(variants, variant)
    ? signature?.[variant]
      ? 'true'
      : 'false'
    : signature[variant]
}

export const useVariants: UseVariants = (signature, schema) => {
  return computed(() => {
    const signatureValue = toValue(signature)
    const { base, variants, compoundVariants } = schema

    const resource = [base]

    for (const variant in variants) {
      const selected = getSelected(variants, variant, signatureValue)
      if (selected)
        resource.push(variants[variant][selected])
    }

    for (const condition of compoundVariants ?? []) {
      const variantRules: Partial<OptionsOf<typeof variants>>
        = condition.variants ?? {}
      const builder = condition.builder ?? (() => true)

      if (
        Object.keys(variantRules).every((variant) => {
          const selected = getSelected(variants, variant, signatureValue)
          if (Array.isArray(variantRules[variant]))
            return Array.from(variantRules[variant] as any).includes(selected)

          return selected === variantRules[variant]
        })
        && builder()
      )
        resource.push(condition.class)
    }

    // remove empty, duplicate classes and join
    return resource
      .flat()
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
      .join(' ')
  })
}
