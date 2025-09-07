'use server';

import { parse } from 'node-html-parser';
import { Match } from '@/app/utils/hockey/matches';
import { loadMatches } from '@/app/server/utils/fs';

const getHtml = () =>
    fetch('https://www.championat.com/hockey/_superleague/tournament/6608/calendar/', {
        headers: {
            'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'upgrade-insecure-requests': '1',
        },
        referrer: 'https://www.championat.com/hockey/_superleague/tournament/6608/',
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
    }).then((res) => res.text());

const getYandex = () =>
    fetch(
        'https://yandex.ru/search/result?yu=5087572881671306272&sk=uf3a8340392e68c47b6827c312c497680&primary_reqid=1757243956525671-15566570591086529183-balancer-l7leveler-kubr-yp-vla-138-BAL&tmpl_version=releases%2Ffrontend%2Fweb4%2Fv4.226-e4c13b3627690f003635d2ed12bc253d64c61899&text=%D0%9A%D0%A5%D0%9B&from=os&clid=1836588&rdrnd=779792&lr=16&redircnt=1757243956.1&ajax=%7B%22ajax-updater%22%3A%7B%22block%22%3A%22i-react-ajax-update%22%2C%22settings%22%3A%7B%22dataType%22%3A%22json%22%7D%2C%22context%22%3A%7B%7D%2C%22alwaysCallCallback%22%3Atrue%2C%22adapter%22%3A%22biathlon%22%2C%22subtype%22%3A%22sport%2Fcompetition%22%2C%22preventAjaxMethod%22%3Afalse%7D%2C%22extra-content%22%3A%7B%7D%2C%22lazy-load%22%3A%7B%7D%2C%22amt%22%3A%7B%22las%22%3A%22hash_0*J0ZQ0gJ0tZ03d0ID0WB0~W0k00DM0ij0TI18d0FR0-d0Ra0hO0tE0Cs0u80pF0f_07e05I0la0nX02b0BW0bj0OQ14D12j0kf0MA0p50Ts0gy0Ln08l0Pv0SM0GC0JK0H01140Nf0BC0Nb0dC0qF10P0Yx03n0AU0g_0mK0Io03Q0eM0Pq14g12N09.0!y0*S13_1970g~0.30hM0o.0KA0By0gt0kc0_U0YJ0*v0A404p0i_0zo18x0D41280MY0sT05y0jX0O!0JN0l30qg0gE0~~0CA0Z204d0ca0Fj0TW0dF0zl19L0LF0~90kM0il0O*09w09p0fS0XN0LB0!H0Eb13l0yI0JT0Lx0Sj0ZC03z0AW0gr0Up0qB15M0oQ08q0TG13.08g0_u16V0320OL0EH0Pa0wV0na08a0V60kd18P15q0d_0p00X20Xs0hv0lB18j0tr0z102y0eX0nw0B10UI0n!0y*0820pS00n0rK0ws0p60*i0ZY0gO0Sa0uX0bR0Q20L-0X_0_10MW0.X0Zg0_d18.0J-0IB0~P13702i0zw0GI0970-40220c70-k0iy18E03r0ub0t80sh0B*01_05W0PN0fa0kX0QN0nM0gF0yE0gI0~*0pH0Bd0050CB0010O30nQ02811F0dA0bc09x0eS0*m16108r13~06q0pP0f10000-D0A!0AO0ok0yp0Ux0XO13Z04M0yJ0Hi0R!0AX0ny0qC0Dy0wK0vQ0nc0RM0TH0_v0UQ0vP0DS0V707I02j0u30Rt01!19P0TX15c0ty0Ly0Sk09Z0c80iz03s0ef01-05X0PO04e0VV0j!0y90cI0Fk0oP0vb0zx0GJ0zm19M0LG0~a0Ap0980kN0O_0Q909q0fT0LC0-50!I0q80JU0Dn0230U70Xc0z00ya0Hq03U01c0ag15G0Qs0jj0-l0lf18F0Rp0uc0VB0ts0yq0t904-0m_0KZ0s_0si0B_0mt10u0.r0d20.70-f0fI08h0Pb0im0vM0Ec13m0lP0ZD0Rc0EK0OM0wW0nb18Q0P60vl0yD0f20*w0fb0kY0bD0RT0cH11k0Qw07a0m-0vm09T0L!01204~02F0Gy0qh16q0vL0JD03I0hw02z0830cb0dG0aC09n0ZJ0130Jo0v90gs0_n0yg0hF15N0oR0vV0tD02n0*n0330_~0EI0bW0Nw0Uu14R08b0vz0ke0h712A09I07p08c04m0~h0Jv18_0mb15r0d-00W0X!06E0iX0sn0T90!60-20N60*h0!T05j0cC0f.06f0p10o-0Rb0X30Xt14N0of0~C0P007f0lC0Q618k0A~0*K09m0z20Oh0RL01m0eY07y0D70nx14.0Sx07H0Iw0mw02m0o00~N0qS0y_02B0Vh0x~0Xl0xp0NA0m602_0QR0BY0H90cB0YO0Cr0-e0iG0Rv0Z30pT00o0rL0J*0wt0p70gP0*j0ZZ0f*0h20Q30X-0_20MX0Qv13-0.Y0hp0NW04_0Zh0_e18~19D0Hf0J!0IC0~Q1380QO0W90nN0zE0o10rN0Nj0if0Jt0cd0pQ0.605G17Q0Bq0ja0Bk0Pz14e0GW0rt0IF06j0pb0f30CI0ou0sz0Qi0_*06n0.t16m0Wx0i712B0DW0z_0AZ0z~0Ma15d16B07i0kt0Qo0_c0m70MM0dX0Vq19t0rP0yK19y0Bz0ON0zv0s~0QV0tv0lV0bk0qu0E20Sw0Mb0x71000DX02k0z-0wI0id0SK0fW0A.0i80z*18l0z815e16C10S0gK07o0kU0Nk0en0D_0pR05H0hu07j0Br0DD04S03R0DZ0e_03Z0t40~K0OI0_g0ku0Qp0ej0m80Vg0990BB0YU0Ii0MN0dY0bK0Vr19u12l0zF0Vi0.b0760pU0sQ0SL0o20jn0rO12J0vo0dW17R0DJ0jb0Bl0NB0Yk0xY0i-0q00ZA0SR0PA14f0iA0I30GX06a0qN05817B0oH0ru17q0IG06k0pc0f40QF08m0xC0CJ0ov0sA09u0Qj0__06o01u0_X0X70.u16n0YM0940Wy12C0l4%3Bca_136%3Bca_77%3Bca_67%3Bca_124%3Bca_69%3Bca_65%3Bua_31%3Bua_8%2F731962%3Bua_1%3BOO_disable_tabs2_0_4169416602%3Bua_3%3Bca_150%3Bua_11%3Bca_341%3Bca_178%3Bca_146%3Bbeauty_safe_search_modes_0_1513%3Bdirect_without_mark_0_411%3Bfuturis_alice_0_474%22%7D%2C%22log%22%3A%7B%22event%22%3A%22append%22%2C%22parentId%22%3A%22%22%7D%7D&main-reqid=1757243956525671-15566570591086529183-balancer-l7leveler-kubr-yp-vla-138-BAL&sport_entities=QAFqAwiTFw%3D%3D&type=biathlon&client=nmeta&wizextra=wiz-sport-setup%3Dcalendar_params%3D%7B%22limit_past%22%3A10%2C%22limit_future%22%3A10%2C%22matches_date%22%3A%222025-09-07T10%3A30%3A00%22%7D',
        {
            headers: {
                accept: '*/*',
                'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                'content-language': 'yaabxhr=9u8Ev80EFs12WW-nbDwAlg==',
                'device-memory': '8',
                downlink: '10',
                dpr: '1.5',
                ect: '4g',
                priority: 'u=1, i',
                rtt: '50',
                'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
                'sec-ch-ua-arch': '"x86"',
                'sec-ch-ua-bitness': '"64"',
                'sec-ch-ua-full-version': '"139.0.7258.155"',
                'sec-ch-ua-full-version-list':
                    '"Not;A=Brand";v="99.0.0.0", "Google Chrome";v="139.0.7258.155", "Chromium";v="139.0.7258.155"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-model': '""',
                'sec-ch-ua-platform': '"Windows"',
                'sec-ch-ua-platform-version': '"19.0.0"',
                'sec-ch-ua-wow64': '?0',
                'sec-ch-viewport-height': '1271',
                'sec-ch-viewport-width': '1073',
                'sec-cookie-deprecation': 'label_only_3',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'viewport-width': '1073',
            },
            referrer:
                'https://yandex.ru/search/?text=%D0%BA%D1%85%D0%BB&from=os&clid=1836588&rdrnd=779792&lr=16&redircnt=1757243956.1',
            body: null,
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        }
    ).then((res) => res.json());

type ParsedMatch = Pick<Match, 'date' | 'isFinished' | 'result'> & {
    homeTeam: { name: string };
    guestTeam: { name: string };
};

type YaTeam = {
    id: number;
    name: string;
};

type YaMatch = {
    teams: [YaTeam, YaTeam];
    result: [number | null, number | null];
    status: string;
    date: { timestamp: number };
    endStatus: 'regular' | 'shootout' | 'overtime';
};

const endStatusToWinType = {
    regular: 'regulation',
    shootout: 'shootout',
    overtime: 'overtime',
} as const;

const parseAllMatches = (html: string): ParsedMatch[] => {
    const root = parse(html);
    const matches: ParsedMatch[] = [];

    const rows = root.querySelectorAll('.stat-results__row');
    for (const row of rows) {
        const dateElement = row.querySelector('.stat-results__date-time');
        const teamElements = row.querySelectorAll('.table-item__name');
        const scoreElement = row.querySelector('.stat-results__count-main');
        const winTypeElement = row.querySelector('.stat-results__count-ext');

        const dateText = dateElement?.textContent.trim();
        const homeTeam = teamElements[0]?.textContent.trim();
        const awayTeam = teamElements[1]?.textContent.trim();
        const scoreText = scoreElement?.textContent.trim();
        const winTypeChar = winTypeElement?.textContent.trim();

        // Проверяем, завершен ли матч
        const isFinished = scoreText !== '– : –' && scoreText !== undefined;
        // Добавляем результат если матч завершен
        const scoreMatch = scoreText?.match(/(\d+)\s*:\s*(\d+)/);

        if (!homeTeam || !awayTeam || !dateText || !isFinished || !scoreMatch) {
            continue;
        }

        // Парсим дату
        const dateMatch = dateText.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})/);
        let timestamp = 0;

        if (dateMatch) {
            const [, day, month, year, hours, minutes] = dateMatch;
            const date = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                parseInt(hours),
                parseInt(minutes)
            );
            timestamp = date.getTime();
        }

        let winType: Required<Match>['result']['winType'] = 'regulation';

        if (winTypeChar === 'Б') {
            winType = 'shootout';
        } else if (winTypeChar === 'ОТ') {
            winType = 'overtime';
        }

        const homeScore = parseInt(scoreMatch[1]);
        const guestScore = parseInt(scoreMatch[2]);

        matches.push({
            homeTeam: { name: homeTeam },
            guestTeam: { name: awayTeam },
            date: timestamp,
            isFinished,
            result: { homeScore, guestScore, winType },
        });
    }

    return matches;
};

export const updateMatches = async () => {
    if (typeof window !== 'undefined') {
        return;
    }

    const fs = await import('fs');
    // здесь только результаты завершённых матчей
    const html = await getHtml();
    const championatMatches = parseAllMatches(html);
    const yaMatches: typeof championatMatches = [];

    try {
        // здесь актуальные счета в том числе по идущим матчам
        const ya = await getYandex();
        ya['ajax-updater'].params.calendar.matches.forEach((match: YaMatch) => {
            yaMatches.push({
                date: match.date?.timestamp,
                homeTeam: { name: match.teams?.[0]?.name },
                guestTeam: { name: match.teams?.[1]?.name },
                isFinished: match.status === 'finished',
                // @ts-expect-error da pihui
                result:
                    match.status === 'not_started'
                        ? undefined
                        : {
                              homeScore: match.result?.[0] || 0,
                              guestScore: match.result?.[1] || 0,
                              winType:
                                  match.status === 'finished'
                                      ? endStatusToWinType[match.endStatus]
                                      : undefined,
                          },
            });
        });
    } catch (e) {
        console.log('Cannot get data from yandex', e);
    }

    const parsedMatches = [...championatMatches, ...yaMatches];
    const oldMatches = loadMatches();

    const newMatches = oldMatches.map((match) => {
        if (match.isFinished) {
            return match;
        }

        const parsedMatch = parsedMatches.find(
            (el) =>
                !!el.result &&
                el.date === match.date &&
                (match.homeTeam.name.includes(el.homeTeam.name) ||
                    match.guestTeam.name.includes(el.guestTeam.name) ||
                    el.homeTeam.name.includes(match.homeTeam.name) ||
                    el.guestTeam.name.includes(match.guestTeam.name))
        );

        if (!parsedMatch) {
            return match;
        }

        return {
            ...match,
            isFinished: parsedMatch.isFinished,
            result: parsedMatch.result,
        };
    });

    fs.writeFileSync('app/utils/hockey/matches.json', JSON.stringify(newMatches));
};
