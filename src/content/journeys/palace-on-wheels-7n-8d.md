---
variant: B
title: Palace on Wheels
tripTypeTag: Luxury Train — Fixed Departures
signatureFeature: A Week in Royal Rajasthan

heroImage: ../../assets/placeholders/journey-hero.jpg
heroImageAlt: PLACEHOLDER-IMAGE awaiting the client photo archive — Palace on Wheels hero
gallery: []

nights: 7
days: 8
routeCities:
  - Delhi
  - Jaipur
  - Sawai Madhopur
  - Chittorgarh
  - Udaipur
  - Jaisalmer
  - Jodhpur
  - Bharatpur
  - Agra
  - Delhi
startCity: Delhi
endCity: Delhi

# PROVISIONAL — agency-assigned, pending client sign-off (PRD Open Question #14)
pace: moderate
idealFor:
  - couples
  - seniors
  - first-timers
bestSeason: September to April

# PROVISIONAL — distilled from the operator description; the source doc carries
# no highlight list of its own. Pending client review.
highlights:
  - lead: Board
    text: one of the world's most celebrated luxury trains, built in the spirit of the royal carriages of Rajasthan's former princely states.
  - lead: Begin
    text: in Jaipur, the ideal gateway to royal Rajasthan, with its palaces, bazaars and hilltop forts.
  - lead: Track
    text: tigers on safari at Sawai Madhopur, on the edge of the Ranthambore reserve.
  - lead: Drift
    text: across Lake Pichola in Udaipur, the Venice of the East, ringed by palaces at the water's edge.
  - lead: Ride
    text: a camel across the dunes at Jaisalmer, the Golden City rising out of the Thar Desert.
  - lead: Wander
    text: the blue-washed lanes beneath Mehrangarh Fort in Jodhpur.
  - lead: Close
    text: with the Taj Mahal at Agra before the train returns to Delhi.

glanceRows:
  - { dayNo: 1, destination: Delhi, signatureExperience: "Boarding, welcome ceremony and departure" }
  - { dayNo: 2, destination: Jaipur, signatureExperience: "The Pink City — fort, palace and bazaars" }
  - { dayNo: 3, destination: Sawai Madhopur & Chittorgarh, signatureExperience: "Morning tiger safari, then Rajasthan's greatest fort" }
  - { dayNo: 4, destination: Udaipur, signatureExperience: "Lake Pichola boat ride and the City Palace" }
  - { dayNo: 5, destination: Jaisalmer, signatureExperience: "Golden City havelis and a camel ride on the dunes" }
  - { dayNo: 6, destination: Jodhpur, signatureExperience: "Mehrangarh Fort above the blue city" }
  - { dayNo: 7, destination: Bharatpur & Agra, signatureExperience: "Keoladeo birdlife, then the Taj Mahal" }
  - { dayNo: 8, destination: Delhi, signatureExperience: "Arrival back in Delhi and disembarkation" }

# PROVISIONAL DAY NARRATIVES. The operator document supplies the route, cabins,
# inclusions, booking process and cancellation rules but NO day-by-day section.
# These are drafted from the published route so the page is structurally
# complete; every one is flagged for client sign-off in M5.
itineraryDays:
  - dayNo: 1
    title: Delhi — All Aboard
    provisional: true
    transport: { mode: overnight-train, detail: Board at Delhi }
    narrative: >-
      Gather at the station in Delhi for the welcome ceremony and boarding.
      Settle into your cabin as the train pulls away, and take dinner on board
      as the week ahead begins.
    overnight: Overnight aboard the train
  - dayNo: 2
    title: Jaipur — The Pink City
    provisional: true
    narrative: >-
      Wake in Jaipur, the ideal gateway to royal Rajasthan. The day takes in
      the city's forts, its palace complex and the bustle of its bazaars,
      before returning to the train.
    overnight: Overnight aboard the train
  - dayNo: 3
    title: Sawai Madhopur & Chittorgarh — Tigers and Ramparts
    provisional: true
    narrative: >-
      A morning safari at Sawai Madhopur, on the edge of the Ranthambore
      reserve, in search of tiger. Later, the ramparts of Chittorgarh — the
      largest fort in Rajasthan and among the most storied in India.
    overnight: Overnight aboard the train
  - dayNo: 4
    title: Udaipur — Venice of the East
    provisional: true
    transport: { mode: boat, detail: Lake Pichola boat ride }
    narrative: >-
      Udaipur is built around its lakes, and the day includes a boat ride on
      Lake Pichola alongside the City Palace complex that rises straight from
      the water.
    overnight: Overnight aboard the train
  - dayNo: 5
    title: Jaisalmer — The Golden City
    provisional: true
    narrative: >-
      Jaisalmer rises out of the Thar Desert in sandstone the colour of honey.
      Explore the living fort and its merchant havelis, then head to the dunes
      for a camel ride as the light goes long.
    overnight: Overnight aboard the train
  - dayNo: 6
    title: Jodhpur — Beneath Mehrangarh
    provisional: true
    narrative: >-
      Mehrangarh Fort stands above Jodhpur on a sheer rock face, with the
      blue-washed old city spread below it. The day covers the fort and the
      lanes beneath before the train moves on.
    overnight: Overnight aboard the train
  - dayNo: 7
    title: Bharatpur & Agra — Birdlife and the Taj
    provisional: true
    transport: { mode: drive, detail: Rickshaw ride at Bharatpur }
    narrative: >-
      A morning among the birdlife of Keoladeo at Bharatpur, explored by
      cycle-rickshaw, then on to Agra and the Taj Mahal — the journey's closing
      note before the last night on board.
    overnight: Overnight aboard the train
  - dayNo: 8
    title: Delhi — Journey's End
    provisional: true
    narrative: >-
      The train arrives back in Delhi after breakfast. Disembark with
      assistance from the station team for your onward arrangements.
    overnight: Departure day

# ---- Variant B modules: required by the schema, so a train page cannot ship
# ---- without its disclosure, policies and booking process.

cabinCategories:
  - name: Deluxe Cabin
    facilities:
      - The base cabin category — every journey inclusion below applies
      - Excursions by coach with a shared guide
  - name: Super Deluxe Cabin
    facilities:
      - Private car (Innova or similar) for excursions
      - Dedicated private guide
      - 30-minute spa session for a couple, one time only
  - name: Suite
    facilities:
      - Private car (Innova or similar) for excursions
      - Dedicated private guide
      - Indian brands of liquor and beer included, subject to available stock
  - name: Presidential Suite
    flagship: true
    facilities:
      - Luxury private car (Fortuner or similar) for excursions
      - Dedicated private guide
      - Indian and foreign brands of liquor and beer included, subject to available stock
      - 30-minute spa session for a couple, one time only

inclusions:
  - Palace on Wheels accommodation as per occupancy
  - All meals on board, or as per the itinerary
  - City sightseeing tours as listed in the itinerary
  - Air-conditioned vehicle for all transfers
  - Guides for all tours in coaches
  - Monument entrances
  - Park and palace entrance fees
  - Cultural programmes
  - Camel ride at Jaisalmer
  - Boat ride at Udaipur
  - Rickshaw ride at Bharatpur
  - Assistance for all station transfers
  - All applicable taxes and service charges

exclusions:
  - Optional tours noted in the itinerary
  - Liquor, spa treatments and gratuities
  - Travel insurance
  - Telephone calls and laundry
  - Video, film and professional still camera fees
  - Arrival and departure transfers
  - International and domestic air tickets
  - Any tour extensions, unless specifically named as part of the journey

departureSeasonLabel: 2026–27 season
departureInfo: >-
  Seasonal departures — enquire for current dates. The Palace on Wheels runs a
  fixed-departure schedule that the operator sets and may revise each season,
  so we confirm live availability with RTDC for your dates rather than publish
  a timetable that could go stale.

bookingSteps:
  - step: 1
    title: Select and finalise the journey
    detail: We confirm your departure and cabin category, then share the booking form together with the cancellation terms. Passport copies are needed to record each traveller's name, nationality and passport number.
  - step: 2
    title: Pay the 40% advance
    detail: An advance of 40% against the invoice secures the booking. If your international flights are already arranged, share the details at this stage.
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
      minimum 15% cancellation fee applies on the gross train ticket value if we
      are informed more than 95 days before departure; 30% between 65 and 94
      days; 55% between 35 and 64 days; and 100% if informed less than 34 days
      before departure, or in the event of a no-show.
  - heading: No-shows and journeys ended early
    body: >-
      In the case of a no-show or non-arrival, no refund or adjustment applies
      and the whole amount is treated as forfeited. If you end the journey part
      way through, for any reason, the unused portion is also treated as
      forfeited.
  - heading: Amendments
    body: >-
      All amendments are subject to approval by RTDC as the train tour
      operator. Amendments are generally only considered in circumstances such
      as natural disaster or serious illness supported by a doctor's
      certificate, and are decided case by case. No amendment is permitted on
      group or whole-train bookings. Requests to change travel dates or
      passenger names are governed by the cancellation rules above and require
      RTDC approval.
  - heading: If the operator cancels a departure
    body: >-
      If a scheduled departure does not operate, you will be informed at least
      one week beforehand. In that case the full amount received is refunded, or
      credited against future travel services, without any cancellation fee.
  - heading: Visas and travel documents
    body: >-
      All foreign passport holders require a valid Indian visa before boarding
      a flight to India. Requests for refunds arising from visa refusal, or
      from arriving without the correct travel documents, are governed by the
      cancellation rules above.
  - heading: Operator's right to amend
    body: >-
      The train operator reserves the right to amend the itinerary, fees and
      cancellation or refund rules. Any resulting difference or additional
      charge is payable by the guest as per the operator's rules.

operatorName: RTDC — Rajasthan Tourism Development Corporation, Government of Rajasthan
# PROVISIONAL WORDING — pending the client's confirmation of the exact GSA
# disclosure language (PRD Open Question #15).
operatorDisclosure: >-
  India Visit is an authorised booking agent (GSA) for the Palace on Wheels.
  The train is owned and operated by RTDC, the Rajasthan Tourism Development
  Corporation, Government of Rajasthan, and the operator's terms apply to your
  journey. Our liability is that of booking agent.
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
    text: The train runs a seasonal schedule through the cooler months. We confirm current departure dates on enquiry.
  - icon: pace
    label: Pace
    text: Moderate. You unpack once and the train moves overnight, with a full excursion most days.

customiseCopy: >-
  Departures fill early, and cabin categories sell out at different rates —
  tell us your dates and we will check live availability with the operator.

related: []
featured: true

seo:
  metaTitle: Palace on Wheels — 7 Nights / 8 Days Luxury Train
  metaDescription: Book the Palace on Wheels through an authorised agent. Seven nights from Delhi through Jaipur, Ranthambore, Udaipur, Jaisalmer, Jodhpur and Agra, with cabin categories explained.
---

To travel Rajasthan by Palace on Wheels is to unpack once and let the state come to you. The train leaves Delhi and returns to it, and in the week between it threads together the places that made Rajasthan's reputation: Jaipur's forts and bazaars, tiger country at Sawai Madhopur, the lakes and palaces of Udaipur, the desert sandstone of Jaisalmer, the blue lanes beneath Mehrangarh at Jodhpur, and finally Agra and the Taj Mahal.

The appeal is the rhythm as much as the route. Nights are spent aboard while the train moves, mornings arrive somewhere new, and the day's excursions, meals, guides and entrance fees are all arranged before you board. India Visit books this journey as an authorised agent, which means the operator runs the train and we handle everything around it — from the booking form to the person meeting you at the airport.
