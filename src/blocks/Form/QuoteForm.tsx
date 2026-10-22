'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { WhatsAppIcon } from '@/components/site/icons'
import { WhatsAppAnchor } from '@/components/site/WhatsAppAnchor'
import { useDictionary } from '@/i18n/client'

import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/** Form-builder form, submitted to Payload (saved under Leads → Inquiries). */
export const QuoteForm: React.FC<{ form: FormType }> = ({ form: formFromProps }) => {
  const { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = formFromProps

  const formMethods = useForm({ defaultValues: {} as Record<string, unknown> })
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const router = useRouter()
  const t = useDictionary()

  const onSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      setError(undefined)
      setIsLoading(true)
      // Honeypot: bots fill hidden fields
      if (data._company_website) {
        setIsLoading(false)
        setHasSubmitted(true)
        return
      }
      const submissionData = Object.entries(data)
        .filter(([name]) => name !== '_company_website')
        .map(([field, value]) => ({ field, value: value == null ? '' : String(value) }))

      try {
        const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
          body: JSON.stringify({ form: formID, submissionData }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        })
        const res = await req.json().catch(() => ({}))
        setIsLoading(false)

        if (req.status >= 400) {
          setError(res.errors?.[0]?.message || t.form.failed)
          return
        }

        setHasSubmitted(true)
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({ event: 'quote_submit', form_id: formID })

        if (confirmationType === 'redirect' && redirect?.url) router.push(redirect.url)
      } catch {
        setIsLoading(false)
        setError(t.form.offline)
      }
    },
    [router, formID, redirect, confirmationType, t],
  )

  if (hasSubmitted && confirmationType === 'message') {
    return (
      <div role="status" className="flex flex-col items-start gap-6">
        {confirmationMessage && <RichText data={confirmationMessage} enableGutter={false} />}
        <WhatsAppAnchor className="btn btn-primary" message={t.form.afterSubmitMessage}>
          <WhatsAppIcon />
          {t.form.continueWhatsApp}
        </WhatsAppAnchor>
      </div>
    )
  }

  return (
    <FormProvider {...formMethods}>
      <form id={String(formID)} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
        <div className="flex flex-wrap gap-x-3 gap-y-6">
          {formFromProps.fields?.map((field: FormFieldBlock, index: number) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
            if (!Field) return null
            return <Field key={index} form={formFromProps} {...field} {...formMethods} errors={errors} register={register} />
          })}
          <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="_company_website">{t.form.honeypot}</label>
            <input id="_company_website" tabIndex={-1} autoComplete="off" {...register('_company_website')} />
          </div>
        </div>
        {error && (
          <p role="alert" className="rounded-2xl bg-[#c2410c]/10 px-5 py-4 text-[1.0625rem] font-medium text-[#c2410c]">
            {error}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <button form={String(formID)} type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
            {isLoading ? t.form.sending : submitButtonLabel || t.form.send}
          </button>
          <p className="text-[1rem] text-muted">{t.form.preferChat}</p>
        </div>
      </form>
    </FormProvider>
  )
}
