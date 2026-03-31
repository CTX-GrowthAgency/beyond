# Sold Out Ticket Functionality

## ✅ Features Implemented

### 1. Ticket Capacity Detection
**Logic**: Added `hasAvailableTickets` state to check if any ticket type has capacity > 0

```typescript
// Check if any tickets have capacity > 0
const hasAvailableTickets = ticketTypes.some(ticket => (ticket.capacity ?? 0) > 0);
```

### 2. Individual Ticket Sold Out Display
**Behavior**: Shows "SOLD OUT" instead of price for individual ticket types with 0 capacity

```typescript
<div className="ev-dialog-ticket-price">
  {(ticket.capacity ?? 0) > 0 
    ? `₹${ticket.price?.toLocaleString("en-IN")}`
    : <span className="sold-out">SOLD OUT</span>
  }
</div>
```

### 3. Global Sold Out State
**Behavior**: Shows "All tickets are sold out" when ALL ticket types have 0 capacity

```typescript
{!hasAvailableTickets ? (
  <p className="ev-dialog-empty">All tickets are sold out.</p>
) : (
  // Normal ticket selection UI
)}
```

### 4. Disabled Controls for Sold Out Tickets
**Behavior**: Disables increment/decrement buttons for sold out ticket types

```typescript
<button
  disabled={(ticket.capacity ?? 0) === 0}
  className="ev-dialog-counter-btn"
>
  +
</button>
```

### 5. Sold Out Booking Button
**Behavior**: Shows "SOLD OUT" and disables button when no tickets available

```typescript
<button
  disabled={totalTickets === 0 || !hasAvailableTickets}
  className={`ev-dialog-book-btn ${!hasAvailableTickets ? 'sold-out' : ''}`}
>
  {!hasAvailableTickets ? "SOLD OUT" : "Book Tickets"}
</button>
```

## 🎨 Visual Styling

### Sold Out Text
- **Color**: Red (`var(--color-error)`)
- **Font**: Bold weight, uppercase, letter-spacing
- **Class**: `.sold-out`

### Sold Out Button
- **Background**: Red (`var(--color-error)`)
- **Text**: White (`var(--color-bg-light)`)
- **State**: Disabled cursor, no hover effects
- **Class**: `.ev-dialog-book-btn.sold-out`

## 📱 User Experience

### Scenarios Handled

1. **All Tickets Available**
   - Shows normal prices
   - All controls enabled
   - "Book Tickets" button active

2. **Some Tickets Sold Out**
   - Shows "SOLD OUT" for unavailable types
   - Shows prices for available types
   - Disables controls for sold out types
   - "Book Tickets" button active if any tickets available

3. **All Tickets Sold Out**
   - Shows "All tickets are sold out" message
   - No ticket selection UI
   - "SOLD OUT" button disabled

4. **No Ticket Types**
   - Shows "No tickets available" message
   - No interaction possible

## 🔄 State Management

### Added States
- `hasAvailableTickets`: Boolean tracking if any tickets have capacity
- Updated existing `totalTickets` and `totalAmount` calculations
- Maintained existing `isLoggingIn` and user states

### Conditional Rendering
- Three-tier display logic:
  1. No ticket types → "No tickets available"
  2. No available capacity → "All tickets are sold out"
  3. Some capacity available → Normal ticket selection UI

## 🎯 Key Benefits

### For Users
- ✅ **Clear Visual Feedback**: Red "SOLD OUT" text is immediately recognizable
- ✅ **Prevents Confusion**: Can't select sold out tickets
- ✅ **Accurate Pricing**: Only shows prices for available tickets
- ✅ **Professional Appearance**: Consistent with event industry standards

### For Administrators
- ✅ **Easy Management**: Just set capacity to 0 in Sanity
- ✅ **Automatic Updates**: UI updates immediately
- ✅ **No Code Changes**: Works with existing ticket structure

### For Developers
- ✅ **Maintainable**: Clear, readable logic
- ✅ **Extensible**: Easy to add more availability rules
- ✅ **Type Safe**: Proper TypeScript handling

## 📊 CSS Classes Added

```css
/* Sold out text styling */
.ev-dialog-ticket-price.sold-out {
  color: var(--color-error);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Sold out button styling */
.ev-dialog-book-btn.sold-out {
  background: var(--color-error);
  color: var(--color-bg-light);
  cursor: not-allowed;
  transform: none;
  opacity: 0.9;
}
```

## 🚀 Production Ready

The sold out functionality is now fully implemented with:
- ✅ Build successful (Exit code: 0)
- ✅ No TypeScript errors
- ✅ Complete visual feedback
- ✅ Proper state management
- ✅ Responsive design maintained
- ✅ Accessibility preserved

Users will now clearly see when tickets are sold out and cannot accidentally select unavailable options! 🎉
