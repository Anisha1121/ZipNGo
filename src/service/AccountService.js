import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { toast } from 'sonner';

/**
 * Reset user account by deleting all their trips
 * @param {string} userEmail - The email of the user whose account to reset
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
 */
export const resetUserAccount = async (userEmail) => {
  if (!userEmail) {
    toast.error('User email is required for account reset');
    return false;
  }

  try {
    console.log('Starting account reset for:', userEmail);
    
    // Query all trips for this user
    const q = query(
      collection(db, 'AITrips'), 
      where('userEmail', '==', userEmail)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      toast.success('Account is already clean - no trips found');
      return true;
    }

    // Delete all user trips
    const deletePromises = [];
    let tripCount = 0;
    
    querySnapshot.forEach((docSnapshot) => {
      const tripData = docSnapshot.data();
      console.log('Deleting trip:', tripData.id || docSnapshot.id);
      deletePromises.push(deleteDoc(doc(db, 'AITrips', docSnapshot.id)));
      tripCount++;
    });

    // Execute all deletions
    await Promise.all(deletePromises);
    
    console.log(`Successfully deleted ${tripCount} trips for user: ${userEmail}`);
    toast.success(`Account reset successful! Deleted ${tripCount} trip${tripCount === 1 ? '' : 's'}`);
    
    return true;
    
  } catch (error) {
    console.error('Error resetting user account:', error);
    toast.error('Failed to reset account. Please try again.');
    return false;
  }
};

/**
 * Get trip count for a user
 * @param {string} userEmail - The email of the user
 * @returns {Promise<number>} - Number of trips the user has
 */
export const getUserTripCount = async (userEmail) => {
  if (!userEmail) return 0;
  
  try {
    const q = query(
      collection(db, 'AITrips'), 
      where('userEmail', '==', userEmail)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
    
  } catch (error) {
    console.error('Error getting user trip count:', error);
    return 0;
  }
};
