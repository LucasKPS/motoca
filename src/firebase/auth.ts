import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';

export interface UserProfile {
    id: string;
    vehicle?: string;
    plate?: string;
    notifyNewRuns?: boolean;
    notifyPromos?: boolean;
    avatarUrl?: string;
}

export const updateProfile = async (uid: string, data: Partial<UserProfile>) => {
    const profileRef = doc(db, 'deliveryCouriers', uid);
    
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
        // Document exists, so we update it.
        await updateDoc(profileRef, data);
    } else {
        // Document doesn't exist, so we create it.
        // The security rule requires an 'id' field on creation.
        await setDoc(profileRef, { ...data, id: uid });
    }
};

export const getProfile = async (uid: string): Promise<Partial<UserProfile> | null> => {
    const profileRef = doc(db, 'deliveryCouriers', uid);
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
        return profileSnap.data() as UserProfile;
    }

    return null;
};