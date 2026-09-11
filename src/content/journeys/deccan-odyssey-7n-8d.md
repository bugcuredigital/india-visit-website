---
variant: B
title: Deccan Odyssey — Heritage Odyssey
tripTypeTag: Luxury Train — Fixed Departures
signatureFeature: Delhi to Delhi Through Royal Rajasthan and Ranthambore

# ⚑ STOP-AND-FLAG — CLIENT_REVIEW_SHEET.md §22.
# The operator document supplied for this train (docs/itineraries/Deccan
# Odyssey - World`s Leading Luxury Train.docx) carries the ROUTE, the
# highlights paragraph, cabin types, inclusions, exclusions, the confirmation
# process and the full policy set — but NO day-by-day programme. The Template
# Spec (§5) recorded this document as "content-complete"; it is not.
#
# What is on this page: everything the document supplies, ported faithfully.
# The DAY ENTRIES below are the one thing it does not supply. They are built
# from the route in the order the operator lists it (eight stops = eight days,
# matching 7N/8D exactly) and from the document's own highlight sentences —
# nothing else. Every day is marked `provisional: true`, which renders the
# on-page "provisional" note, and the page must not launch until the operator's
# daily programme has been supplied and these entries replaced with it.

# TEMP-PHOTO — temporary Unsplash image for design review only. The client's
# own archive replaces this; see docs/brand/processed/TEMP-PHOTO-PROVENANCE.md
heroImage: ../../assets/temp-photos/TEMP-PHOTO-home-hero-udaipur.jpg
heroImageAlt: The palaces of Udaipur at the edge of Lake Pichola in warm evening light
gallery: []

nights: 7
days: 8
routeCities:
  - Delhi
  - Agra
  - Sawai Madhopur
  - Udaipur
  - Jodhpur
  - Jaisalmer
  - Jaipur
  - Delhi
startCity: Delhi
endCity: Delhi

# PROVISIONAL — agency-assigned, pending client sign-off (PRD Open Question #14).
pace: moderate
idealFor:
  - couples
  - seniors
  - first-timers
bestSeason: October to March

# From the operator document's highlight paragraph.
highlights:
  - lead: Visit
    text: India's architectural wonders and World Heritage Sites in Agra, Jaipur, Jodhpur, Jaisalmer and Ranthambore, from one train.
  - lead: Browse
    text: the colourful, bustling bazaars of the royal cities of Rajasthan.
  - lead: Search
    text: for the elusive tiger on a safari at Ranthambore, the reserve on the edge of Sawai Madhopur.
  - lead: Travel
    text: from Delhi to Jaisalmer and back in luxury, by way of Agra, Sawai Madhopur, Udaipur, Jodhpur and Jaipur.
  - lead: Unpack
    text: once, in a Deluxe cabin or the Presidential Suite, with valet service and every meal aboard.

glanceRows:
  - { dayNo: 1, destination: Delhi, signatureExperience: "Boarding and departure" }
  - { dayNo: 2, destination: Agra, signatureExperience: "The Taj Mahal and Agra's World Heritage Sites" }
  - { dayNo: 3, destination: Sawai Madhopur, signatureExperience: "Tiger safari at Ranthambore" }
  - { dayNo: 4, destination: Udaipur, signatureExperience: "The lake city" }
  - { dayNo: 5, destination: Jodhpur, signatureExperience: "Mehrangarh and the blue city" }
  - { dayNo: 6, destination: Jaisalmer, signatureExperience: "The golden fort in the Thar" }
  - { dayNo: 7, destination: Jaipur, signatureExperience: "The Pink City's forts, palaces and bazaars" }
  - { dayNo: 8, destination: Delhi, signatureExperience: "Arrival; the journey ends" }

# ⚑ PROVISIONAL, all eight — see the note at the top of this file.
itineraryDays:
  - dayNo: 1
    title: Delhi — Boarding
    transport: { mode: train, detail: Departs Delhi }
    narrative: >-
      Board the Deccan Odyssey at Delhi. The week ahead runs south to Agra and
      then west across Rajasthan — Sawai Madhopur, Udaipur, Jodhpur, Jaisalmer
      and Jaipur — before returning to the capital, with the distances covered
      overnight while you sleep. The operator's daily programme, including
      boarding time and the order of the evening, is supplied on booking.
    overnight: Overnight aboard
    provisional: true
  - dayNo: 2
    title: Agra — The Taj and the Fort
    transport: { mode: train, detail: Overnight from Delhi }
    narrative: >-
      Agra holds two of India's World Heritage Sites within a few kilometres of
      each other — the Taj Mahal and Agra Fort — and the day is given to them.
      The operator's programme sets the order and the timings.
    overnight: Overnight aboard
    provisional: true
  - dayNo: 3
    title: Sawai Madhopur — Tigers at Ranthambore
    transport: { mode: train, detail: Overnight from Agra }
    narrative: >-
      Sawai Madhopur is the railhead for Ranthambore, and the day's excursion
      is a safari into the reserve in search of the tiger. Sightings are never
      promised by anyone honest; the fort above the park and the lakes below it
      make the drive worthwhile regardless.
    overnight: Overnight aboard
    provisional: true
  - dayNo: 4
    title: Udaipur — The City of Lakes
    transport: { mode: train, detail: Overnight from Sawai Madhopur }
    narrative: >-
      Udaipur, the lake city of Mewar, with its palaces at the water's edge.
      The operator's programme sets the day's excursion.
    overnight: Overnight aboard
    provisional: true
  - dayNo: 5
    title: Jodhpur — Beneath Mehrangarh
    transport: { mode: train, detail: Overnight from Udaipur }
    narrative: >-
      Jodhpur, the blue city, under one of the largest forts in India. The
      day's excursion takes in the fort and the bazaars beneath it, as set
      by the operator's programme.
    overnight: Overnight aboard
    provisional: true
  - dayNo: 6
    title: Jaisalmer — The Golden City
    transport: { mode: train, detail: Overnight from Jodhpur }
    narrative: >-
      Jaisalmer rises out of the Thar in honey-coloured sandstone — the fort
      still lived in, the carved havelis, and the desert beyond. The day's
      programme is the operator's.
    overnight: Overnight aboard
    provisional: true
  - dayNo: 7
    title: Jaipur — The Pink City
    transport: { mode: train, detail: Overnight from Jaisalmer }
    narrative: >-
      Jaipur, with its forts, palaces and the bazaars the operator's
      highlights single out. The day's programme is the operator's, and the
      train runs back to Delhi overnight.
    overnight: Overnight aboard
    provisional: true
  - dayNo: 8
    title: Delhi — The Journey Ends
    transport: { mode: train, detail: Overnight from Jaipur }
    narrative: >-
      Breakfast aboard as the train arrives in Delhi, where the journey ends.
      We can arrange your onward transfer or a night in the city.
    overnight: Departure
    provisional: true

cabinCategories:
  - name: Deluxe Cabin
    facilities:
      - Twin-bedded cabin with an en suite bathroom
      - Valet service
      - One child under five may share a double bed with parents, subject to availability at booking
  - name: Presidential Suite
    flagship: true
    facilities:
      - Separate bedroom with a double bed and a living room with a sofa-cum-bed
      - Accommodates up to three adults, or two adults and two children
      - Valet service

# Verbatim from the operator document.
inclusions:
  - Accommodation in a double or twin-bedded cabin with en suite bathroom
  - All meals — breakfast, lunch and dinner
  - Soft beverages during the journey
  - Valet service
  - Still-camera fees
  - Guided off-train excursions and game drives as set out in the itinerary, including entrance fees, park fees, transport and the services of an English-speaking local guide

exclusions:
  - GST and VAT, insurance and gratuities
  - Laundry and alcoholic beverages
  - Video and professional still-camera fees
  - Arrival and departure transfers
  - International and domestic air tickets, and visa fees
  - Pre- and post-tour accommodation and any extensions, unless specifically named as part of the journey
  - Any activity described as optional in the itinerary

departureSeasonLabel: 2026–27 season
departureInfo: >-
  Seasonal departures — enquire for current dates. The Deccan Odyssey runs a
  fixed-departure schedule set by the operator and revised each season, so we
  confirm live availability for your dates rather than publish a timetable
  that could go stale. Each departure needs a minimum occupancy to operate;
  if that is not reached the operator may cancel with at least 45 days'
  notice.

# PROVISIONAL — the advance percentage is the booking agent's commercial term
# in the source document, not the operator's; client to confirm India Visit's
# own (CLIENT_REVIEW_SHEET.md §22).
bookingSteps:
  - step: 1
    title: Select and finalise the journey
    detail: We confirm your departure and cabin category, then share the booking form together with the cancellation terms. Passport copies are needed to record each traveller's name, nationality and passport number.
  - step: 2
    title: Pay the advance
    detail: An advance of 30% against the invoice secures the booking. If your international flights are already arranged, share the details at this stage.
  - step: 3
    title: Receive written confirmation
    detail: Once the advance is received you get a confirmation email and letter, along with a breakdown of the amount received and the balance due.
  - step: 4
    title: Adjust the details
    detail: Tell us about anything you would like added or changed and we will check what is possible with the operator — some changes cannot be accommodated on a fixed-departure train.
  - step: 5
    title: Clear the balance 95 days before arrival
    detail: The balance must be cleared at least 95 days before arrival in India. We send a receipt once it is in.
  - step: 6
    title: Arrival assistance
    detail: About a week before departure we share your arrival assistance details — who will meet you at the airport and the name of your assigned guest relations manager.

policies:
  - heading: Cancellation charges
    body: >-
      Cancellation requests must be made in writing and acknowledged by us. A
      minimum 10% cancellation fee applies on the gross train ticket value if
      we are informed more than 95 days before departure; 30% between 60 and
      94 days; 50% between 45 and 59 days; and 100% if informed less than 45
      days before departure, or in the event of a no-show.
  - heading: No-shows and journeys ended early
    body: >-
      In the case of a no-show or non-arrival, no refund or adjustment applies
      and the whole amount is treated as forfeited. If you end the journey part
      way through, for any reason, the unused portion is also treated as
      forfeited.
  - heading: Children
    body: >-
      The train accommodates children, and the operator asks parents to be
      mindful of the adult atmosphere it maintains. One child under five may
      travel free in a Deluxe cabin sharing a double bed with parents, subject
      to availability; a child between five and twelve sharing a Deluxe cabin
      with one adult is charged half the adult fare. For families with older
      children the operator recommends the Presidential Suite, where the
      living-room sofa-bed accommodates them; two children between six and
      twelve need a second cabin. There are no interconnecting cabins. We will
      set out the arrangement that fits your family before you book.
  - heading: Amendments and date changes
    body: >-
      All amendments are subject to the train tour operator's approval and are
      generally considered only in circumstances such as natural disaster or
      serious illness supported by a doctor's certificate, decided case by
      case. No amendment is permitted on group or whole-train bookings. A
      request to postpone the same passengers to a future date carries a
      per-person charge and needs the operator's approval; changes to travel
      dates or passenger names are otherwise governed by the cancellation rules
      above.
  - heading: If the operator cancels a departure
    body: >-
      If a scheduled departure does not operate, you will be informed at least
      one week beforehand, and the full amount received is refunded, credited
      against future travel, or held as a credit note — without any
      cancellation fee. We cannot compensate for consequential costs such as
      air tickets or hotel bookings made independently.
  - heading: Visas and travel documents
    body: >-
      All foreign passport holders require a valid Indian visa before boarding
      a flight to India. Requests for refunds arising from visa refusal, or
      from arriving without the correct travel documents, are governed by the
      cancellation rules above.
  - heading: Operator's right to amend
    body: >-
      The train operator reserves the right to amend the itinerary, fees and
      cancellation or refund rules, and because the train runs on Indian
      Railways track, the routing is subject to change. Scheduled excursions
      cancelled by the tour manager at short notice for local reasons are not
      refundable. Any resulting difference or additional charge is payable by
      the guest as per the operator's rules.

# PROVISIONAL — the source document refers only to "the Deccan Odyssey train
# tour operator" and never names it; the train is Maharashtra Tourism's.
# Client to confirm the operator name and the disclosure wording (PRD Open
# Question #15, CLIENT_REVIEW_SHEET.md §22).
operatorName: Maharashtra Tourism Development Corporation (train tour operator)
operatorDisclosure: >-
  India Visit is an authorised booking agent for the Deccan Odyssey. The train
  is run by its train tour operator, Maharashtra Tourism Development
  Corporation, and the operator's terms apply to your journey. Our liability is
  that of booking agent.
bookingTermsUrl: /booking-terms/

practicalNotes:
  - icon: passport
    label: Visa
    text: Foreign passport holders need a valid Indian visa before boarding their flight to India.
  - icon: plane
    label: Getting there
    text: The journey begins and ends in Delhi; Indira Gandhi International Airport (DEL) is the arrival point.
  - icon: calendar
    label: Season
    text: The train runs a seasonal schedule through the cooler months, and each departure needs a minimum occupancy to operate. We confirm current dates on enquiry.
  - icon: pace
    label: Pace
    text: Moderate. You unpack once and the train moves overnight, with a full excursion most days.

customiseCopy: >-
  Departures fill early, and the two cabin categories sell out at different
  rates — tell us your dates and we will check live availability with the
  operator.

related:
  - palace-on-wheels-7n-8d
  - golden-chariot-5n-6d
  - rajasthan-classic-12n-13d
# Gated branded PDF — regenerated from this entry by `npm run pdf:build`.
pdfFile: /downloads/deccan-odyssey-7n-8d.pdf
featured: false

seo:
  metaTitle: Deccan Odyssey — Heritage Odyssey, 7 Nights / 8 Days from Delhi
  metaDescription: Book the Deccan Odyssey's Heritage Odyssey through an authorised agent — Delhi to Delhi by way of Agra, Ranthambore, Udaipur, Jodhpur, Jaisalmer and Jaipur, cabins explained.
---

The Deccan Odyssey's Heritage Odyssey is the western circuit: Delhi to Agra
for the Taj, then a week's arc across Rajasthan — the tiger reserve at
Ranthambore, the lakes of Udaipur, Jodhpur under Mehrangarh, Jaisalmer in the
Thar and Jaipur's forts and bazaars — before the train brings you back to the
capital. Seven nights aboard, the distances covered while you sleep, and every
excursion, meal and guide arranged before you board.

India Visit books this journey as an authorised agent: the operator runs the
train and we handle everything around it. The day-by-day programme on this
page follows the operator's route and highlights; the operator's own daily
timings are supplied with your booking.
