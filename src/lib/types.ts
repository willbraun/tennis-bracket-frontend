export interface PbListResponse<T> {
	page: number
	perPage: number
	totalItems: number
	totalPages: number
	items: T[]
}

export interface Draw {
	collectionId: string
	collectionName: 'draw'
	created: string
	end_date: string
	event: 'Mens Singles' | 'Womens Singles'
	id: string
	name: string
	prediction_close: string
	size: number
	start_date: string
	updated: string
	url: string
	year: number
}

export interface Slot {
	collectionId: string
	collectionName: 'draw_slot'
	created: string
	draw_id: string
	id: string
	name: string
	position: number
	round: number
	seed: string
	updated: string
}

export interface Prediction {
	collectionId: string
	collectionName: 'view_predictions'
	draw_id: string
	draw_slot_id: string
	round: number
	position: number
	seed: string
	id: string
	name: string
	points: number
	user_id: string
	username: string
}

export interface PredictionRecord {
	collectionId: string
	collectionName: 'prediction'
	created: string
	draw_slot_id: string
	id: string
	name: string
	points: number
	updated: string
	user_id: string
}

export interface SelectedUser {
	id: string
	username: string
	color: string
}

export interface AuthResult {
	data: {
		error: string
	}
	status: number
	type: string
}

export interface SelectUserResult {
	data: {
		user: SelectedUser
		error: string
	}
	status: number
	type: string
}

export interface DeselectUserResult {
	data: {
		deletedId: string
		error: string
	}
	status: number
	type: string
}

export interface AddPredictionResult {
	data: {
		record: PredictionRecord
		error: string
	}
	status: number
	type: string
}
