# Festival Gunung Selamet - API Specification

## Authentication APIs

### POST /auth/login
**Admin login**
```json
Request:
{
  "email": "admin@festival.com",
  "password": "password123"
}

Response (200):
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clx123abc",
      "name": "Admin User",
      "email": "admin@festival.com",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

Response (401):
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

### POST /auth/logout
**Admin logout**
```json
Request: {} (token in header)

Response (200):
{
  "statusCode": 200,
  "message": "Logout successful"
}
```

### GET /auth/me
**Get current admin info**
```json
Response (200):
{
  "statusCode": 200,
  "data": {
    "id": "clx123abc",
    "name": "Admin User",
    "email": "admin@festival.com",
    "role": "ADMIN",
    "created_at": "2024-01-15T08:00:00Z"
  }
}
```

## Dashboard APIs

### GET /dashboard/stats
**Dashboard overview statistics**
```json
Response (200):
{
  "statusCode": 200,
  "data": {
    "totalEvents": 12,
    "totalRegistrations": 1247,
    "eventsByStatus": {
      "DRAFT": 1,
      "PUBLISHED": 3,
      "COMPLETED": 8,
      "CANCELLED": 0
    },
    "recentRegistrations": 45, // 7 days
    "registrationsByMonth": [
      { "month": "2024-01", "count": 234 },
      { "month": "2024-02", "count": 345 }
    ]
  }
}
```

### GET /dashboard/registrations/geography
**Registration statistics by location**
```json
Response (200):
{
  "statusCode": 200,
  "data": {
    "byProvince": [
      { "province": "Jawa Tengah", "count": 523 },
      { "province": "Jawa Barat", "count": 312 },
      { "province": "DI Yogyakarta", "count": 198 }
    ],
    "byCity": [
      { "city": "Purbalingga", "province": "Jawa Tengah", "count": 89 },
      { "city": "Banyumas", "province": "Jawa Tengah", "count": 76 }
    ]
  }
}
```

## Event Management APIs

### GET /events
**Get all events with pagination**
```json
Query params: ?page=1&limit=10&status=PUBLISHED&search=festival

Response (200):
{
  "statusCode": 200,
  "data": {
    "events": [
      {
        "id": "clx456def",
        "title": "Festival Musik Gunung Selamet",
        "description": "Festival musik tahunan...",
        "start_date": "2024-06-15T09:00:00Z",
        "end_date": "2024-06-16T18:00:00Z",
        "location": "Lereng Gunung Selamet, Purbalingga",
        "banner_url": "https://example.com/banner.jpg",
        "status": "PUBLISHED",
        "created_at": "2024-01-10T10:00:00Z",
        "creator": {
          "id": "clx123abc",
          "name": "Admin User"
        },
        "registrationCount": 234
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 12,
      "totalPages": 2
    }
  }
}
```

### GET /events/:id
**Get single event details**
```json
Response (200):
{
  "statusCode": 200,
  "data": {
    "id": "clx456def",
    "title": "Festival Musik Gunung Selamet",
    "description": "Festival musik tahunan di lereng Gunung Selamet...",
    "start_date": "2024-06-15T09:00:00Z",
    "end_date": "2024-06-16T18:00:00Z",
    "location": "Lereng Gunung Selamet, Purbalingga",
    "banner_url": "https://example.com/banner.jpg",
    "status": "PUBLISHED",
    "created_at": "2024-01-10T10:00:00Z",
    "updated_at": "2024-01-15T14:30:00Z",
    "creator": {
      "id": "clx123abc",
      "name": "Admin User",
      "email": "admin@festival.com"
    },
    "registrationCount": 234,
    "registrationStats": {
      "today": 5,
      "thisWeek": 23,
      "thisMonth": 89
    }
  }
}
```

### POST /events
**Create new event**
```json
Request:
{
  "title": "Festival Seni Budaya 2024",
  "description": "Festival seni budaya tahunan...",
  "start_date": "2024-07-20T09:00:00Z",
  "end_date": "2024-07-21T18:00:00Z",
  "location": "Lapangan Gunung Selamet",
  "banner_url": "https://example.com/banner.jpg",
  "status": "DRAFT"
}

Response (201):
{
  "statusCode": 201,
  "message": "Event created successfully",
  "data": {
    "id": "clx789ghi",
    "title": "Festival Seni Budaya 2024",
    // ... other fields
  }
}
```

### PUT /events/:id
**Update event**
```json
Request:
{
  "title": "Festival Seni Budaya 2024 (Updated)",
  "description": "Updated description...",
  "status": "PUBLISHED"
}

Response (200):
{
  "statusCode": 200,
  "message": "Event updated successfully",
  "data": {
    "id": "clx789ghi",
    "title": "Festival Seni Budaya 2024 (Updated)",
    // ... updated fields
  }
}
```

### DELETE /events/:id
**Delete event**
```json
Response (200):
{
  "statusCode": 200,
  "message": "Event deleted successfully"
}
```

## Registration APIs

### GET /events/:eventId/registrations
**Get registrations for specific event**
```json
Query params: ?page=1&limit=20&search=john&province=Jawa Tengah

Response (200):
{
  "statusCode": 200,
  "data": {
    "registrations": [
      {
        "id": "clx101112",
        "full_name": "John Doe",
        "whatsapp": "081234567890",
        "province": "Jawa Tengah",
        "city": "Purbalingga",
        "district": "Kemangkon",
        "postal_code": "53355",
        "registered_at": "2024-02-15T14:30:00Z",
        "event": {
          "id": "clx456def",
          "title": "Festival Musik Gunung Selamet"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 234,
      "totalPages": 12
    }
  }
}
```

### GET /registrations
**Get all registrations across events**
```json
Query params: ?page=1&limit=20&eventId=clx456def&province=Jawa Tengah&fromDate=2024-01-01&toDate=2024-12-31

Response (200):
{
  "statusCode": 200,
  "data": {
    "registrations": [
      {
        "id": "clx101112",
        "full_name": "John Doe",
        "whatsapp": "081234567890",
        "province": "Jawa Tengah",
        "city": "Purbalingga",
        "district": "Kemangkon",
        "postal_code": "53355",
        "registered_at": "2024-02-15T14:30:00Z",
        "event": {
          "id": "clx456def",
          "title": "Festival Musik Gunung Selamet",
          "start_date": "2024-06-15T09:00:00Z"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1247,
      "totalPages": 63
    }
  }
}
```

### POST /events/:eventId/register
**Public registration (no auth required)**
```json
Request:
{
  "full_name": "Jane Smith", 
  "whatsapp": "081987654321",
  "province": "Jawa Tengah",
  "city": "Banyumas", 
  "district": "Purwokerto Utara",
  "postal_code": "53114"
}

Response (201):
{
  "statusCode": 201,
  "message": "Registration successful",
  "data": {
    "id": "clx131415",
    "full_name": "Jane Smith",
    "registered_at": "2024-02-20T10:15:00Z",
    "event": {
      "id": "clx456def",
      "title": "Festival Musik Gunung Selamet"
    }
  }
}

Response (400):
{
  "statusCode": 400,
  "message": "Event is not available for registration",
  "errors": ["Event status must be PUBLISHED"]
}
```

### GET /registrations/export
**Export registrations to CSV/Excel**
```json
Query params: ?format=csv&eventId=clx456def&fromDate=2024-01-01&toDate=2024-12-31

Response (200):
Content-Type: text/csv or application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="registrations_export_2024.csv"

// CSV content or Excel file
```

## Statistics APIs

### GET /statistics/events
**Event performance statistics**
```json
Response (200):
{
  "statusCode": 200,
  "data": {
    "events": [
      {
        "id": "clx456def",
        "title": "Festival Musik Gunung Selamet",
        "status": "COMPLETED",
        "registrationCount": 234,
        "registrationTarget": 500,
        "registrationRate": 46.8,
        "popularProvinces": ["Jawa Tengah", "Jawa Barat"],
        "peakRegistrationDate": "2024-05-15"
      }
    ],
    "summary": {
      "totalEvents": 12,
      "avgRegistrationPerEvent": 103.9,
      "mostSuccessfulEvent": {
        "id": "clx456def",
        "title": "Festival Musik Gunung Selamet",
        "registrationCount": 234
      }
    }
  }
}
```

### GET /statistics/registrations/trends
**Registration trend analysis**
```json
Query params: ?period=monthly&year=2024

Response (200):
{
  "statusCode": 200,
  "data": {
    "trends": [
      { "period": "2024-01", "count": 89, "events": 2 },
      { "period": "2024-02", "count": 156, "events": 3 },
      { "period": "2024-03", "count": 234, "events": 2 }
    ],
    "growth": {
      "thisMonth": 23.5, // percentage
      "lastMonth": -5.2,
      "yearToDate": 15.8
    }
  }
}
```

## Account Management APIs

### GET /settings/account
**Get account settings**
```json
Response (200):
{
  "statusCode": 200,
  "data": {
    "id": "clx123abc",
    "name": "Admin User",
    "email": "admin@festival.com",
    "role": "ADMIN",
    "created_at": "2024-01-01T08:00:00Z",
    "updated_at": "2024-02-15T10:30:00Z"
  }
}
```

### PUT /settings/account
**Update account settings**
```json
Request:
{
  "name": "Updated Admin Name",
  "email": "new.admin@festival.com"
}

Response (200):
{
  "statusCode": 200,
  "message": "Account updated successfully",
  "data": {
    "id": "clx123abc",
    "name": "Updated Admin Name", 
    "email": "new.admin@festival.com",
    "updated_at": "2024-02-20T14:45:00Z"
  }
}
```

### PUT /settings/password
**Change password**
```json
Request:
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456",
  "confirmPassword": "newpassword456"
}

Response (200):
{
  "statusCode": 200,
  "message": "Password updated successfully"
}

Response (400):
{
  "statusCode": 400,
  "message": "Current password is incorrect"
}
```

## Error Responses

### Common Error Format
```json
{
  "statusCode": 400,
  "message": "Validation error",
  "errors": [
    "Email is required",
    "Password must be at least 8 characters"
  ]
}
```

### Status Codes Used
- **200**: Success
- **201**: Created
- **400**: Bad Request / Validation Error
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **409**: Conflict (duplicate data)
- **500**: Internal Server Error

## Authentication
- All admin endpoints require `Authorization: Bearer <token>` header
- Public registration endpoint `/events/:eventId/register` does not require authentication
- Token expires in 24 hours (configurable)