// import { UserAPI } from "@/lib/api/client";
// import useSWR from "swr";

// export function useUserMe({ onError }: { onError?: (e: any) => void } = {}) {
//     const isClientSide = typeof window !== 'undefined';

//     const { data: user, isLoading, error } = useSWR(
//         '/api/user/me',
//         async () => {
//             if (isClientSide && !localStorage.getItem('token')) {
//                 throw Object.assign(new Error('未登录'), { statusCode: -1 });
//             }
//             return UserAPI.me();
//         },
//         {
//             onError: (error) => {
//                 if (error.statusCode === 401) {
//                     if (isClientSide) {
//                         localStorage.removeItem('token');
//                     }
//                 }

//                 onError?.(error);
//             },
//             revalidateIfStale: false,
//             revalidateOnFocus: false,
//             shouldRetryOnError: (err) => {
//                 if ([-1, 401].includes(err.statusCode)) {
//                     return false;
//                 }
//                 return true;
//             },
//         }
//     );

//     return {
//         user,
//         isLoading,
//         error
//     }
// }