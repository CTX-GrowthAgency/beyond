# Required Firestore Indexes

Create these indexes in your Firebase Console > Firestore > Indexes > Composite Indexes

## 1. User Bookings Query
**Collection:** bookings  
**Fields:** 
- userId (Ascending)
- createdAt (Descending)

**Purpose:** Optimizes the bookings list query for users to see their bookings ordered by date

## 2. Event Bookings by Status
**Collection:** bookings  
**Fields:**
- eventId (Ascending) 
- paymentStatus (Ascending)

**Purpose:** Optimizes fetching bookings for a specific event filtered by payment status

## 3. User Bookings by Status
**Collection:** bookings  
**Fields:**
- userId (Ascending)
- paymentStatus (Ascending)
- createdAt (Descending)

**Purpose:** Optimizes admin queries to see user bookings filtered by status

## 4. Event Date Query
**Collection:** events  
**Fields:**
- eventDate (Ascending)
- slug (Ascending)

**Purpose:** Optimizes event listing pages with date filtering

## 5. Payment Status Tracking
**Collection:** bookings  
**Fields:**
- paymentStatus (Ascending)
- updatedAt (Descending)

**Purpose:** Optimizes webhook processing and payment status tracking

## 6. Event Search by Title
**Collection:** events  
**Fields:**
- title (Ascending)
- eventDate (Descending)

**Purpose:** Optimizes event search functionality

## Index Creation Commands

You can also create these using the Firebase CLI:

```bash
# User bookings query
firebase firestore:indexes create --project=your-project-id <<EOF
{
  "indexes": [
    {
      "collectionGroup": "bookings",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "bookings", 
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "eventId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "paymentStatus", 
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "bookings",
      "queryScope": "COLLECTION", 
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "paymentStatus",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "events",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "eventDate",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "slug",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "bookings",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "paymentStatus",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "updatedAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "events",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "title",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "eventDate",
          "order": "DESCENDING"
        }
      ]
    }
  ]
}
EOF
```

## Single Field Indexes

Ensure these single field indexes are enabled (usually automatic):

### bookings collection
- userId (Ascending)
- eventId (Ascending) 
- paymentStatus (Ascending)
- createdAt (Descending)
- updatedAt (Descending)

### events collection
- slug (Ascending)
- eventDate (Ascending)
- title (Ascending)

### users collection
- uid (Ascending)
- email (Ascending)

## Performance Notes

1. **Cache TTL**: The implemented cache has 5-minute TTL to balance freshness with performance
2. **Batch Operations**: Use batch gets for multiple documents to reduce round trips
3. **Query Optimization**: Always use indexed fields in where clauses and order by
4. **Pagination**: Implement pagination for large datasets using limit() and startAfter()

## Cost Optimization

1. **Document Reads**: Caching reduces reads by ~60-80%
2. **Query Efficiency**: Composite indexes reduce query costs
3. **Data Structure**: Denormalize where possible to avoid extra reads
4. **Batch Size**: Keep batch operations under 500 documents
