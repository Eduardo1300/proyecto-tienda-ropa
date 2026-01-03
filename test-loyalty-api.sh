#!/bin/bash

echo "🧪 Testing Loyalty API Endpoints on Render..."
echo "=============================================="

# Test 1: Check if loyalty API is responding
echo -e "\n✅ Test 1: Loyalty API Status"
curl -s "https://tienda-backend-n67b.onrender.com/loyalty/test" | jq . 2>/dev/null || echo "FAILED"

# Test 2: Get available users for testing
echo -e "\n✅ Test 2: Available Users"
curl -s "https://tienda-backend-n67b.onrender.com/loyalty/test/users" | jq '.data[] | {id, email, firstName, lastName}' 2>/dev/null || echo "FAILED"

# Test 3: Generate test token
echo -e "\n✅ Test 3: Generate Test Token"
TOKEN_RESPONSE=$(curl -s "https://tienda-backend-n67b.onrender.com/loyalty/test/generate-token")
TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.data.token' 2>/dev/null)
USER_ID=$(echo $TOKEN_RESPONSE | jq -r '.data.user.id' 2>/dev/null)
echo "Token for User $USER_ID: $TOKEN" | cut -c1-50

if [ ! -z "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  # Test 4: Get loyalty program
  echo -e "\n✅ Test 4: Loyalty Program Data"
  curl -s -H "Authorization: Bearer $TOKEN" "https://tienda-backend-n67b.onrender.com/loyalty/program" | jq '.data | {id, currentPoints, totalPointsEarned, currentTier}' 2>/dev/null || echo "FAILED"

  # Test 5: Get transactions
  echo -e "\n✅ Test 5: Loyalty Transactions"
  curl -s -H "Authorization: Bearer $TOKEN" "https://tienda-backend-n67b.onrender.com/loyalty/transactions?limit=3" | jq '.data.transactions | .[0:3] | .[] | {type, points, description}' 2>/dev/null || echo "FAILED"

  # Test 6: Get leaderboard
  echo -e "\n✅ Test 6: Loyalty Leaderboard"
  curl -s -H "Authorization: Bearer $TOKEN" "https://tienda-backend-n67b.onrender.com/loyalty/leaderboard" | jq '.data | .[0:3] | .[] | {position, userName, currentPoints, currentTier}' 2>/dev/null || echo "FAILED"
fi

echo -e "\n✅ All tests completed!"
