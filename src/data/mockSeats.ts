import { CabinClass, Seat } from '../types/airline';

export function generateSeatMap(cabinClass: CabinClass): Seat[] {
  const seats: Seat[] = [];

  if (cabinClass === 'business' || cabinClass === 'first') {
    // 1-2-1 Lie Flat Pods: Rows 1-6, Columns A, D, G, K
    const cols = ['A', 'D', 'G', 'K'];
    for (let row = 1; row <= 6; row++) {
      for (const col of cols) {
        // Random availability (mostly available, few booked)
        const isBooked = (row === 1 && col === 'A') || (row === 3 && col === 'D') || (row === 4 && col === 'K');
        seats.push({
          id: `${row}${col}`,
          row,
          col,
          cabin: 'business',
          type: 'lie_flat',
          isAvailable: !isBooked,
          price: 0, // Included in business
          features: [
            'Direct aisle access',
            '180° Fully Lie-flat bed (78" length)',
            '21" 4K HDR Touchscreen',
            'Wireless charging & 65W USB-C',
            col === 'A' || col === 'K' ? 'Window view' : 'Center companion suite',
          ],
        });
      }
    }
    return seats;
  }

  if (cabinClass === 'premium_economy') {
    // 2-3-2 layout: Rows 8-12, Columns A, C, D, E, F, H, K
    const cols = ['A', 'C', 'D', 'E', 'F', 'H', 'K'];
    for (let row = 8; row <= 12; row++) {
      for (const col of cols) {
        const isBooked = (row === 9 && col === 'A') || (row === 10 && (col === 'D' || col === 'E'));
        seats.push({
          id: `${row}${col}`,
          row,
          col,
          cabin: 'premium_economy',
          type: 'extra_legroom',
          isAvailable: !isBooked,
          price: 0,
          features: [
            '38" Pitch with 8" Recline',
            'Calf rest & footrest',
            'Premium noise-canceling audio',
            col === 'A' || col === 'K' ? 'Window view' : col === 'C' || col === 'H' ? 'Aisle seat' : 'Middle seat',
          ],
        });
      }
    }
    return seats;
  }

  // Economy 3-3-3: Rows 14-32, Columns A, B, C, D, E, F, G, H, J
  const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'];
  for (let row = 14; row <= 28; row++) {
    for (const col of cols) {
      // Deterministic booked pattern
      const isBooked =
        (row === 14 && (col === 'B' || col === 'H')) ||
        (row === 16 && (col === 'A' || col === 'C')) ||
        (row === 19 && col === 'E') ||
        (row === 21 && (col === 'D' || col === 'F')) ||
        (row === 24 && col === 'J');

      const isExit = row === 14 || row === 22;
      const isPreferred = row >= 15 && row <= 17;

      let type: Seat['type'] = 'standard';
      let price = 0;
      if (isExit) {
        type = 'exit_row';
        price = 45;
      } else if (isPreferred) {
        type = 'extra_legroom';
        price = 25;
      }

      seats.push({
        id: `${row}${col}`,
        row,
        col,
        cabin: 'economy',
        type,
        isAvailable: !isBooked,
        price,
        features: [
          isExit ? 'Up to 40" Emergency Exit legroom' : isPreferred ? '34" Preferred front-cabin legroom' : '31" Standard seat pitch',
          col === 'A' || col === 'J' ? 'Window seat' : col === 'C' || col === 'D' || col === 'F' || col === 'G' ? 'Aisle seat' : 'Middle seat',
          'Adjustable leather headrest',
          'USB-A & 110V AC power outlet',
        ],
      });
    }
  }

  return seats;
}
