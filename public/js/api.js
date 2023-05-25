// This module provides convenience functions for making API requests from the client.

// Shorthand for fetching data from a GET endpoint
export async function get(path, params) {
   const res = await fetch('/api/' + path + '?' + new URLSearchParams(params));
   const json = await res.json();
   return json;
}

// Shorthand for sending data to a POST endpoint
export async function post(path, data) {
   const res = await fetch('/api/' + path, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
   });
   const json = await res.json();
   return json;
}

