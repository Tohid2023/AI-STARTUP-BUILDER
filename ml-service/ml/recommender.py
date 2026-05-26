def get_recommendations(category):
    """
    Returns curated features, tech stack, and monetization strategies 
    based on the startup category.
    """
    recommendations = {
        "EdTech": {
            "features": [
                "Interactive video lectures",
                "Gamified quizzes and progress tracking",
                "Community discussion forums",
                "AI-driven personalized learning paths"
            ],
            "techStack": ["React", "Node.js", "MongoDB", "WebRTC (for live streaming)", "TensorFlow (for AI paths)"],
            "monetization": ["Freemium subscription", "Pay-per-course", "B2B school licensing"]
        },
        "FinTech": {
            "features": [
                "Secure payment gateway integration",
                "Real-time expense analytics dashboard",
                "KYC and identity verification",
                "AI fraud detection alerts"
            ],
            "techStack": ["React Native", "Python/Django", "PostgreSQL", "Stripe API", "Plaid API"],
            "monetization": ["Transaction fees", "Premium financial insights tier", "API access fees"]
        },
        "HealthTech": {
            "features": [
                "HIPAA-compliant video consultations",
                "Electronic Health Records (EHR) integration",
                "Wearable device syncing",
                "Symptom tracking diary"
            ],
            "techStack": ["Flutter", "Express.js", "MongoDB", "AWS HealthLake"],
            "monetization": ["Telehealth consultation fees", "Subscription for doctors/clinics", "B2B employer wellness plans"]
        },
        "AgriTech": {
            "features": [
                "IoT sensor data dashboard (soil, weather)",
                "Crop yield prediction",
                "Supply chain tracking",
                "Drone imagery integration"
            ],
            "techStack": ["Vue.js", "Python/FastAPI", "InfluxDB (time-series)", "Google Earth Engine"],
            "monetization": ["Hardware sales + software subscription", "Data insights as a service"]
        },
        "SaaS": {
            "features": [
                "Role-based access control (RBAC)",
                "Multi-tenant architecture",
                "Automated billing and invoicing",
                "Custom API integrations"
            ],
            "techStack": ["React", "NestJS", "PostgreSQL", "Stripe", "Redis"],
            "monetization": ["Tiered monthly subscriptions", "Per-user pricing", "Enterprise custom plans"]
        }
    }

    # Default fallback
    default_rec = {
        "features": ["User authentication", "Admin dashboard", "Push notifications"],
        "techStack": ["React", "Node.js", "MongoDB"],
        "monetization": ["SaaS subscription", "Ads", "Freemium"]
    }

    return recommendations.get(category, default_rec)
