---
Tags: [posts,apprenticeships,apprenticeship funding]
Title: Apprenticeship Funding in 2026-27
Date: 2026-09-15
Description: What's changed in apprenticeship funding for 2026-27, including new co-investment rates, the hiring payment, and apprenticeship units.
---

The [How Does Apprenticeship Funding Work?](/posts/how-does-apprenticeship-funding-work/) post from 2021 covers the core mechanics well enough - if TNP, funding caps and completion payments are new to you, start there. The basic structure hasn't changed: funding cap, 20% completion, 80% on-programme split over planned months. Still the same maths.

What has changed is a fair bit of everything else. Here's what's different for 2026-27.

## Who's in charge now

From 1 April 2026, apprenticeship funding moved from DfE to the Department for Work and Pensions. Policy documents now sit under DWP rather than DfE. The systems (Apprenticeship Service, ILR) are the same - but if you're hunting for guidance and the old DfE links have gone cold, that's why.

## Non-levy employers: good news for younger apprentices

The biggest practical change for many providers is the co-investment rules for non-levy employers. Previously, non-levy employers paid 5% of costs for all apprentices, with the government covering 95%. That split still applies - but only for **apprentices aged 25 and over**.

For **apprentices aged 16-24 at non-levy employers**, the government now funds **100% of the cost**. No employer contribution. Full stop.

This removes a genuine barrier for smaller employers taking on younger apprentices. If you work with SMEs who've been put off by the 5% co-investment, it's worth making sure they know.

### The hiring payment

There's also a new **£2,000 apprenticeship hiring payment** for non-levy employers who take on an apprentice aged 16-24, starting from October 2026. It's paid in two equal instalments: the first after 90 days of employment, the second after 365 days (or 242 days for apprenticeships with a typical duration under 12 months). Foundation apprenticeships are included.

## Levy employers who run low

Here's one where the news is less cheerful.

If a levy-paying employer runs out of funds in their digital account, they previously fell back to the standard 5%/95% co-investment split - same as a non-levy employer. That's changed for 2026-27.

Levy employers with insufficient account funds are now on a **25% employer / 75% government** split for apprentices aged 25 and over. That's a material increase in what the employer has to find. For apprentices aged 16-24, the 100% government funding applies here too - consistent with the non-levy rule.

If you have employers on your books who are levy-payers but regularly running their account down to zero, it's worth flagging this to them before it becomes a surprise invoice.

## August 2026: two changes to levy accounts

Two things changed in August 2026 for levy-paying employers.

The government stopped adding a 10% top-up on new funds entering levy accounts. This affects funds going in from August 2026 onwards - existing balances weren't touched. Accounts grow a bit more slowly than before.

The expiry window for new funds was also shortened from 24 months to 12 months. Funds entering accounts from August 2026 will expire after 12 months if unused. For most employers with predictable spend this won't matter, but for those who accumulate funds without a clear delivery plan it's worth reviewing.

## Apprenticeship units

New from April 2026: apprenticeship units are shorter, modular qualifications that sit alongside the existing standards framework. They're a different format from a full apprenticeship standard, aimed at skilling up specific areas without the full commitment of a traditional apprenticeship.

The levy transfer allowance now covers units as well as full apprenticeships, so levy-rich employers can direct transfer funds toward unit delivery.

This is still early days and the details are settling. The DWP is the place to watch for further guidance as this develops.

## Foundation apprenticeships

Foundation apprenticeships are a shorter introductory route aimed at 16-24 year olds, designed to provide a pathway into full apprenticeship standards. They're included in the 100% government funding and the £2,000 hiring payment rules above. Guidance on the specifics is available in the 2026-27 funding rules.

## Off-the-job training

Minimum OTJ hours are no longer set by a fixed rule in the funding guidance. Instead, the minimum volume for each standard is now published individually on the Skills England website. Annex C, which previously listed minimum volumes, has been removed.

In practice this means checking the standard's page on the Skills England site to confirm the minimum hours for a given programme, rather than applying a single across-the-board figure.

The rules also clarify that only *eligible* OTJ training counts toward actual hours - this has always been the case, but the wording is now more explicit (paragraph 85 of the 2026-27 funding rules).

### Recording OTJ and RPL in the ILR

From 2026-27, providers use a new HRSRecord entity in the ILR to record hours relating to apprenticeship programmes. Three HRSType codes apply to apprenticeships:

- **HRSType 1** — planned OTJ hours for the programme
- **HRSType 3** — actual OTJ hours delivered
- **HRSType 4** — planned OTJ hours reduced due to Recognition of Prior Learning (RPL)

This replaces the previous approach of recording these figures elsewhere in the return. The [ILR 2026-27 specification](https://guidance.submit-learner-data.service.gov.uk/26-27/ilr/entity/HRSRecord/) has the full field-level detail.

## ILR changes

A few changes worth noting:

**Planned end date**: the originally-submitted planned end date can no longer be changed after submission, unless there's a formal break or a restart. This isn't a new concept, but it's now a harder rule. Worth double-checking that your enrolment process captures the right date the first time - correcting it later is now more difficult.

**Completion payments**: the completion payment is no longer withheld if co-investment hasn't been collected from the employer. Previously, the funding rules required employer co-investment to be collected and recorded on the ILR before the completion payment could be released. That requirement has been removed (paragraph 190 of the 2026-27 funding rules):

> Removed reference to the employer co-investment having to be collected and recorded on the ILR in order for the completion payment to be released.

This is a meaningful change for providers who've had completion payments held up by an employer's failure to pay their contribution. The apprentice completing is now sufficient.

## Official sources

- [Apprenticeship funding rules: 2026 to 2027](https://www.gov.uk/government/publications/apprenticeship-funding-rules-and-assessment-plan-guidance-2026-to-2027)
- [Apprenticeship funding rules: summary of changes](https://www.gov.uk/government/publications/apprenticeship-funding-rules-and-assessment-plan-guidance-2026-to-2027/apprenticeship-funding-rules-summary-of-changes-version-1)
- [Apprenticeship technical funding guide (from August 2026)](https://www.gov.uk/government/publications/apprenticeship-technical-funding-guide/apprenticeship-technical-funding-guide-from-august-2026)
- [ILR 2026-27 specification: HRSRecord](https://guidance.submit-learner-data.service.gov.uk/26-27/ilr/entity/HRSRecord/)
