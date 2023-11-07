import type { ComputedRef, MaybeRefOrGetter } from 'vue'

export type ClassList = string | string[]

export type Variants = Record<string, Record<string, ClassList>>
export type OptionsOf<V extends Variants> = {
  [K in keyof V]?: V[K] | V[K][]
}

export type Signature = Record<string, any>

export type VariantOptions<V extends Signature> = {
  [K in keyof V]: Record<
    keyof V[K] extends boolean ? 'true' | 'false' : V[K],
    ClassList
  >
}

export interface CompoundVariant<S extends Signature> {
  variants?: Partial<OptionsOf<S>>
  builder?: () => boolean
  class: ClassList
}

export interface VariantsSchema<S extends object> {
  base?: ClassList
  variants: VariantOptions<S>
  compoundVariants?: CompoundVariant<S>[]
}

export type UseVariantsReturn = ComputedRef<string>

export type UseVariants = <S extends Signature>(
  signature: MaybeRefOrGetter<S>,
  schema: VariantsSchema<S>,
) => UseVariantsReturn
