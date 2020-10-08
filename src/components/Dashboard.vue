<template>
	<b-container fluid>
		<b-tabs>
			<b-tab title="Dashboard">
				<div>

					<div v-if="isLoading">
						<b-table :items="items" :fileds="fields" :busy="isBusy">
							<template v-slot:table-busy>
								<div class="text-center text-primary my-2">
									<div v-if="getError" class="text-danger">
										<strong>Chargement échoué</strong> 
									</div>
									<div v-else>
										<b-spinner class="align-middle"></b-spinner>
										<strong> Chargement des personnages...</strong>
									</div>
								</div>
							</template>
						</b-table>
					</div>

					<div v-else>
						<b-table responsive :items="items" :fields="fields">
							<template v-slot:cell(actions)="row">
								<b-button size="sm" variant="primary" @click="edit(row.item, $event.target)" class="mr-1">
									Modifier
								</b-button>

								<b-button size="sm" variant="danger" @click="info(row.item, row.index, $event.target)" class="mr-1">
									Supprimer
								</b-button>
							</template>

							<template v-slot:cell(detail)="row">
								Je suis un {{ row.item.job }} avec la spécialisation {{ row.item.specialisation }} et mon {{ row.item.skillType }} préféré est {{ row.item.skill }}.
							</template>
						</b-table>
					</div>
				</div>
			</b-tab>
			<b-tab title="Ajouter un personnage">
				Contents 2
			</b-tab>
		</b-tabs>

		<b-modal size="lg" :id="editModal.id" :title="editModal.title">
			<character-form />
		</b-modal>

	</b-container>
</template>

<script>
	import axios from 'axios'
	import { API_BASE_URL } from '../config'
	import CharacterForm from './CharacterForm'

	export default {
		data() {
			return {
				isLoading: true,
				isBusy: true,
				getError: false,
				fields: [
					{ key: 'pseudo', label: 'Pseudo', sortable: true },
					{ key: 'race', label: 'Race', sortable: true },
					{ key: 'health', label: 'Points de vie', sortable: true },
					{ key: 'armor', label: 'Armure', sortable: false },
					{ key: 'detail', label: 'Détails', sortable: false },
					{ key: 'owner', label: 'Propriétaire', sortable: true },
					{ key:'actions', label: 'Actions' }
				],
				items: [],
				editModal: {
					id: 'edit-modal',
					title: '',
					item: '',
				}
			}
		},

		async created() {
			try {
				const response = await axios.get(API_BASE_URL + '/characters')
				this.items = response.data.data
				this.isLoading = false
				this.isBusy = false
			}
			catch(e) {
				this.getError = true
			}
		},

		methods: {
			edit(item, button) {
				this.editModal.title = `Modification du personnage ${item.pseudo}`
				this.editModal.item = item
				this.$root.$emit('bv::show::modal', this.editModal.id, button)
			}
		},

		components: { CharacterForm }
	}
</script>