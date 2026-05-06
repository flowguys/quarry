import {staticFile, random} from 'remotion';

// Pool of project photos for the v4 word scenes (BUILT, SHAPED, STRUCTURED,
// DEFINED, year ticker, etc). Sourced from /video-images in /public so
// staticFile() can serve them.
const PROJECT_IMAGES = [
	'6667f87f810174fe1cf7c20a_240105-bishopsmead-view-1_1800x1200.jpg',
	'6667f92b89ed7ce9f6a30727_MEG-outside_resized.jpg',
	'6667f9721dabfdc8244ab892_windmill2_01sq.jpg',
	'6667f9d3692ff013d2a45d54_1200x900-Pewley-Way-01.jpg',
	'6667f9d3a9caa1c1f9fa54bf_1200x900-Pewley-Way-06.jpg',
	'6667fabbe38c3e20409e80e3_Kitlands-1.jpg',
	'6667fbe24581f5d0c3ad774e_resi_guild3_1800x1200_11.jpg',
	'6667fbe24e0bdb84a7a60fae_resi_guild3_1800x1200_12.jpg',
	'6667fbe24f7a95be158d9ebe_resi_guild3_1800x1200_04.jpg',
	'686e48ebf4afad5b57951785_Cortec_-_Guildford_Cathedral-026a.jpg',
	'666825c7bb40a6d394603cf4_girls-high-school-guildford04.jpg',
	'6667fce9124a2781733921e6_Salesian-School-1200x1200-0.jpg',
	'6667fce94620266c4dbad277_Salesian-School-1462x1200-1.jpg',
	'6667fd617eed753cf810bbae_Nutberry-Farm_2133x1200_01-1-1800x1200.jpg',
	'6667fe1e112bac6ef75d684d_resi_barnhouse_1800x1200_08-1-1800x1200.jpg',
	'6667ff1e118ee12514522e61_PDBirchdene-1200x800-06.jpg',
	'6667ff1ec85341472022ff93_PDBirchdene-1200x1800-10.jpg',
	'6667ff25c2bca0275c794b16_PDBirchdene-1200x800-16.jpg',
	'6668006b851286b1397fd6c0_Welland-House-1804x1200-01-1800x1200.jpg',
	'66680384764a77da559b2026_educ_rapkins_1800x1200_03.jpg',
	'666803d2e24e956d4afbf707_educ_rapkins_1800x1200_11-800x1200.jpg',
	'66681339dac3272eeca3e5bf_educ_rapkins_1800x1200_06-1.jpg',
	'6668150d89b296f626882078_Edu_Tol_1800x1200_03.jpg',
	'6668150dd96f0cdcec4f0af0_edu_nds_1800x1200.jpg',
	'6668150dfd39dc001e5cb406_edu_ops_1600x1200-1200x1200.jpg',
	'66681b1fe078114252f80157_educ_rapkins_1800x1200_09.jpg',
	'66681bb33de21936b012706e_PDEdu_Tol_1800x1200_14-1800x1200.jpg',
	'66681bb3e6678a14e1ac5cfa_PDEdu_Tol_1800x1200_18-1800x1200.jpg',
	'66681bb42c3e381cbf4a09da_PDEdu_Tol_800x1200_19.jpg',
	'66681bb456f111537aa0ccb6_PDEdu_Tol_800x1200_13.jpg',
	'66681c203346952eed04a29c_edu_surreyuni_1800x1200_02.jpg',
	'66681c20b0cb70c5eee1e8a0_edu_surreyuni_1800x1200_03.jpg',
	'66681c20bafa99e40f6a4f38_edu_surreyuni_1800x1200_05-1200x1200.jpg',
	'66681c20bd884b8a7f0033ec_edu_surreyuni_1200x1800_01-1200x1200.jpg',
	'66681cdce078114252f9d641_edu_oss_1800x1200_01.jpg',
	'66681cdcf14d7732b93d74de_edu_oss_1800x1200_05.jpg',
	'66682183a7595192daf2d216_st-peters-portrait03-781x1200.jpg',
	'67bc8739ab86cecdd3ad4194_900x1200_facade.jpg',
	'6667fbe2c43fd10a41690198_resi_guild3_1800x1200_06.jpg',
	'66c3517a589f85f8566bd690_guildford-lido-black-and-white-roof.webp',
	'66c3517a745ce89017966729_guildford-lido-roof.webp',
	'66c3517adbac49ebeb8fd3f7_guildford-lido-inside.webp',
	'66c3517c4a258608d5fade61_guildford-lido-black-and-white.webp',
	'67bc8715c71bab07f5c2e57a_2200x1200_visual_01.jpg',
	'66682183b673bc0248d7713c_st-peters07.jpg',
	'67e56c84510d8670c5684ad8_Lido_2.jpg',
	'6667fbe270502b90364b23b7_resi_guild3_1800x1200_05.jpg',
] as const;

const OPENER_FILE = '65e87f6aab8b7de8a648edb2_home-uk.webp';

/**
 * Deterministic random project photo for the given seed. `random(seed)` is
 * Remotion's seeded RNG, so the same seed always picks the same image and
 * renders are reproducible across machines.
 */
export const randomImage = (seed: string): string => {
	const idx = Math.floor(random(seed) * PROJECT_IMAGES.length);
	return staticFile(`video-images/${PROJECT_IMAGES[idx]}`);
};

/**
 * Distinct image per year for the opening ticker. Walks PROJECT_IMAGES
 * linearly starting at 1988 with no reuse — once the pool is exhausted,
 * returns null so the scene can render a grey placeholder instead.
 */
export const imageForYear = (year: number): string | null => {
	const offset = year - 1988;
	if (offset < 0 || offset >= PROJECT_IMAGES.length) return null;
	return staticFile(`video-images/${PROJECT_IMAGES[offset]}`);
};

/**
 * Reserved images for the four word scenes. Picked from the tail of
 * PROJECT_IMAGES so they never collide with any year (1988–2026 use
 * indices 0–38; these all sit beyond that range).
 */
const WORD_IMAGES = {
	imagined: '67bc8715c71bab07f5c2e57a_2200x1200_visual_01.jpg',
	refined: '66c3517adbac49ebeb8fd3f7_guildford-lido-inside.webp',
	crafted: '66c3517a745ce89017966729_guildford-lido-roof.webp',
	delivered: '66c3517c4a258608d5fade61_guildford-lido-black-and-white.webp',
} as const;

export const imageForWord = (word: keyof typeof WORD_IMAGES): string =>
	staticFile(`video-images/${WORD_IMAGES[word]}`);

/** The opener photo (lush grass field) used as the 1987 establishing shot. */
export const openerImage = (): string =>
	staticFile(`video-images/opener/${OPENER_FILE}`);
