import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './config';

export interface UserProfile {
    vehicle?: string;
    plate?: string;
    notifyNewRuns?: boolean;
    notifyPromos?: boolean;
    avatarUrl?: string;
}

export const updateProfile = async (uid: string, data: UserProfile) => {
    const profileRef = doc(db, 'profiles', uid);
    await setDoc(profileRef, data, { merge: true });
};

export const getProfile = async (uid: string): Promise<UserProfile | null> => {
    const profileRef = doc(db, 'profiles', uid);
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
        return profileSnap.data() as UserProfile;
    }

    return null;
};