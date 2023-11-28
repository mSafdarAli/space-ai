export interface route {
	path: string;
	method: string;
	function: Function;
	uploader?: Function;
	private: Boolean;
	permission?: string;
	perm_component?: string;
	filter?: boolean;
	fields?: object;
	filter_options?: Filter_Options;
	search?: string[];
	defaultSort?: string;
}
export interface Filter_Options { search: string[], defaultSort: string, filters: {[key: string]: {type: string, filter: string}} }