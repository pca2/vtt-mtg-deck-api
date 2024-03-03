// Helper function to fetch room data
export async function fetchRoomData(roomId) {
  const url = `https://virtualtabletop.io/state/${roomId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
}
// Helper function to update room data
export async function updateRoomData(roomId, updatedData) {
  const url = `https://virtualtabletop.io/state/${roomId}`;
  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(updatedData),
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    throw new Error('Failed to update data');
  }
  return response.text();
}