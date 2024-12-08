export interface PSAInfo {
	// pchs_amt_smtl: string;
	// nass_tot_amt: string;
	loan_amt_smtl: string;
	// evlu_pfls_amt_smtl: string;
	// evlu_amt_smtl: string;
	tot_asst_amt: string;
	// tot_lnda_tot_ulst_lnda: string;
	// cma_auto_loan_amt: string;
	// tot_mgln_amt: string;
	// stln_evlu_amt: string;
	// crdt_fncg_amt: string;
	// ocl_apl_loan_amt: string;
	// pldg_stup_amt: string;
	// frcr_evlu_tota: string;
	// tot_dncl_amt: string;
	// cma_evlu_amt: string;
	// dncl_amt: string;
	// tot_sbst_amt: string;
	// thdt_rcvb_amt: string;
	// ovrs_stck_evlu_amt1: string;
	// ovrs_bond_evlu_amt: string;
	// mmf_cma_mgge_loan_amt: string;
	// sbsc_dncl_amt: string;
	// pbst_sbsc_fnds_loan_use_amt: string;
	// etpr_crdt_grnt_loan_amt: string;
}

export interface NotionRow<T> {
	id: string;
	properties: T;
}

export interface TotalProperties {
	평가: {
		number: number | undefined;
	};
	대출?: {
		number: number;
	};
}

export interface NotionTitleProperty {
	title: { text: { content: string } }[];
}

export interface NotionNumberProperty {
	number: number;
}

export interface Asset {
	id: string;
	code?: string;
	quantity?: number;
	purchase?: number;
	target?: number;
	price?: number;
	value?: number;
	ratio?: number;
	currency?: number;
}
