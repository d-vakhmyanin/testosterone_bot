import { useSearchParams } from 'next/navigation';

export const useTgStartParams = () => {
    const searchParams = useSearchParams();
    const tgStartParam = searchParams.get('tgWebAppStartParam') || '';

    const [appName, ...paramsStr] = tgStartParam.split('__');

    const params = paramsStr.reduce<Record<string, string>>((acc, param) => {
        const [key, value] = param.split('=');

        acc[key] = value;

        return acc;
    }, {});

    return {
        appName,
        params,
    };
};
