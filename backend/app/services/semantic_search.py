# Simple keyword understanding without heavy ML models
# Maps user queries to actual product keywords

KEYWORD_SYNONYMS = {
    # Brake related
    "stopping": ["brake", "braking"],
    "stop": ["brake"],
    "braking": ["brake"],
    
    # Engine related
    "motor": ["engine"],
    "power": ["engine"],
    
    # Electrical
    "light": ["electrical", "lamp", "bulb"],
    "lights": ["electrical", "lamp", "bulb"],
    "battery": ["electrical"],
    "spark": ["electrical", "ignition"],
    
    # Common bike terms
    "bike": ["motorcycle"],
    "wheel": ["tire", "rim"],
    "seat": ["saddle"],
}


class SmartSearch:
    """Lightweight keyword expansion for better search"""
    
    def expand_query(self, query: str) -> list:
        """
        Expand user query with synonyms
        Example: "stopping parts" -> ["stopping", "brake", "braking", "parts"]
        """
        words = query.lower().split()
        expanded = set(words)  # Start with original words
        
        for word in words:
            if word in KEYWORD_SYNONYMS:
                expanded.update(KEYWORD_SYNONYMS[word])
        
        return list(expanded)
    
    def search(self, query: str, products: list) -> list:
        """
        Search with keyword understanding
        """
        expanded_keywords = self.expand_query(query)
        
        # Score each product
        scored_products = []
        for product in products:
            score = self.calculate_match_score(product, expanded_keywords)
            if score > 0:
                scored_products.append((product, score))
        
        # Sort by score (highest first)
        scored_products.sort(key=lambda x: x[1], reverse=True)
        
        # Return just the products
        return [p[0] for p in scored_products]
    
    def calculate_match_score(self, product, keywords: list) -> int:
        """Calculate how well a product matches the keywords"""
        score = 0
        product_text = " ".join([
            product.product_name or "",
            product.part_number or "",
            product.bike_models or "",
            product.category or "",
            product.brand or "",
            product.description or ""
        ]).lower()
        
        for keyword in keywords:
            if keyword in product_text:
                score += 1
        
        return score
