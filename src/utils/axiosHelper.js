import axios from 'axios';

const endpoint = 'http://10.0.2.2:8080/v1';
// const endpoint = 'https://next-bus-67f78.el.r.appspot.com/v1';
const token =
  'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjkyODg2OGRjNDRlYTZhOThjODhiMzkzZDM2NDQ1MTM2NWViYjMwZDgiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVHJpZGVlcCBEYXMiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSllGSGdLd3JlWWVvd00zcVFBLWRNRURNTHFFcER2NEIzLVZwNXBYNFBuNlVJVFlBPXM5Ni1jIiwicm9sZXMiOlsiU1VQRVJfQURNSU4iLCJBRE1JTiIsIk9XTkVSIiwiRFJJVkVSIiwiQVNTSVNUQU5UX0RSSVZFUiIsIkhBTkRZTUFOIl0sIm9yZ2FuaXphdGlvbl9pZCI6MSwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL25leHQtYnVzLTY3Zjc4IiwiYXVkIjoibmV4dC1idXMtNjdmNzgiLCJhdXRoX3RpbWUiOjE3MzIzNTUzOTksInVzZXJfaWQiOiJ5QW8xeFVGOHFuZXB4aWFNNkZpcDVrTlY3bmcxIiwic3ViIjoieUFvMXhVRjhxbmVweGlhTTZGaXA1a05WN25nMSIsImlhdCI6MTczMjM1NTM5OSwiZXhwIjoxNzMyMzU4OTk5LCJlbWFpbCI6InRyZHAub3JnQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTExNjEzNDQ5NDc4MDg5NzM1NjYyIl0sImVtYWlsIjpbInRyZHAub3JnQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.H2UE-ICFs5e9BmbwUnWE9ckdtdRLnjXbs4Fv0MrSmTgAv9nBUlY5dNa31JMaYkr1aKwV3UcNRDkxod71MEOBiHjUoPDmwoS6TuIFv_EVr351jpHrJHBe0q8MfbBaYD26QVA-7t7e39wMaVUqEJ4QvSDoGrW4IWzq-HA8nsNa7Cv0FKSCHdm-tTdq0witKZkYOoeNIydplEorNn2RyBxuw6GmDJCRqp0cbQ3puQ4MaNenzoxEezKImL3cLmjBnId8n6HVhWzVF4tRcsFi1ZprFSI5P-7EFw78Z5DIX_0fsIsDvoU1l6quPtsHUhGi8G--9b8xI_XkHt2dAUsBXrosyw';

const axiosInstance = axios.create({
  baseURL: endpoint,
  headers: {'Content-Type': 'application/json'},
});

// Define your PUT request function
export async function makePutRequest(url, data) {
  try {
    axiosInstance.defaults.headers.common.Authorization = token;
    console.log('request making', url, data);
    const response = await axiosInstance.put(url, data);
    console.log('request made', response.status);
    return response.data;
  } catch (error) {
    // Handle errors
    if (error.response) {
      console.error('Error Response:', error.response.data);
    } else if (error.request) {
      console.error('Error Request:', error.request);
    } else {
      console.error('Error Message:', error.message);
    }
    throw error;
  }
}
