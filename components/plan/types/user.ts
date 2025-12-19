// types/user.ts (或直接寫在 Profile.vue 裡)

// 模擬 Firebase User 的核心欄位
export interface FirebaseUser {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    isAnonymous?: boolean;
}

// 您的系統內部 UserProfile 定義
export interface UserProfile {
    id: string;
    yearOfBirth: any; // 兼容輸入框可能回傳字串
    dateOfBirth: any;
    gender: string;
    age: number;
    lifeExpectancy: number;
    careerInsuranceType: string,
}