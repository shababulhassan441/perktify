
import { fetchAllCases, fetchAllTiers, fetchAllUsers, fetchUserDetails, fetchUserLatestRegistrations, fetchUserLevel } from '@/lib/data';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  
  const query = searchParams.get('query') || ''; // Default to an empty query if not provided
  const currentPage = parseInt(searchParams.get('page'), 10) || 1; // Default to page 1 if not provided

  try {
    const documents = await fetchAllUsers();
    
    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cases' },
      { status: 500 }
    );
  }
}
