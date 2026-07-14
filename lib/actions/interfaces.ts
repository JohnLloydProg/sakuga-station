export interface FormState {
	success: boolean;
	message?: string;
	errors?: Record<string, string[] | undefined>;
}
