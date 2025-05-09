import { NextRequest, NextResponse } from "next/server";

const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY!;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET!;
const AMADEUS_AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const AMADEUS_FLIGHTS_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers";

async function getAmadeusAccessToken() {
  const response = await fetch(AMADEUS_AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: AMADEUS_API_KEY,
      client_secret: AMADEUS_API_SECRET,
    }),
  });

  if (!response.ok) throw new Error("Failed to authenticate with Amadeus");

  const data = await response.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      adults,
      children,
      maxPrice,
      nonStop,
    } = await req.json();

    const token = await getAmadeusAccessToken();

    const searchParams = new URLSearchParams({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      adults: String(adults),
      currencyCode: "BRL",
    });

    if (returnDate) searchParams.append("returnDate", returnDate);
    if (children > 0) searchParams.append("children", String(children));
    if (maxPrice) searchParams.append("maxPrice", maxPrice);
    if (nonStop) searchParams.append("nonStop", "true");
    searchParams.append("max", "10");

    const flightRes = await fetch(`${AMADEUS_FLIGHTS_URL}?${searchParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const flightData = await flightRes.json();

    if (!flightRes.ok) {
      console.error("Amadeus error:", flightData);
      return NextResponse.json({ error: "Error searching for flights" }, { status: 400 });
    }

    const parsedFlights = (flightData.data || []).map((f: any) => {
      const itinerary = f.itineraries[0];
      const segment = itinerary.segments[0];

      return {
        id: f.id,
        airline: segment.carrierCode,
        price: parseFloat(f.price.total),
        origin: segment.departure.iataCode,
        destination: segment.arrival.iataCode,
        departure: segment.departure.at,
        arrival: segment.arrival.at,
        stops: itinerary.segments.length - 1,
        segments: itinerary.segments,
      };
    });

    const carriers = flightData.dictionaries?.carriers || {};

    return NextResponse.json({
      flights: parsedFlights,
      carriers,
    });
  } catch (err) {
    console.error("Flights API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
