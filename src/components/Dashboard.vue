<template>
	<b-container fluid class="mt-2">
		<div>
			<h1>Gestion des personnages de la guilde de Tom</h1>
		</div>
		<div class="mb-2 mt-2">
			<b-button size="md" variant="success" @click="add($event.target)" class="mr-1">
				Ajouter un personnage
			</b-button>
		</div>
		<div>
			<div v-if="isLoading">
				<b-table :items="formatedItems" :fileds="fields" :busy="isBusy" caption-top responsive>
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
				<b-table table-variant="secondary" head-variant="light" :items="formatedItems" :fields="fields" caption-top responsive>
					<template v-slot:cell(actions)="row">
						<b-button size="sm" variant="primary" @click="edit(row.item, $event.target)" class="mr-1">
							Modifier
						</b-button>

						<b-button size="sm" variant="danger" @click="remove(row.item, $event.target)" class="mr-1">
							Supprimer
						</b-button>
					</template>

					<template v-slot:cell(detail)="row">
						Je suis un {{ row.item.job }} avec la spécialisation {{ row.item.specialisation }} et mon {{ row.item.skillType }} préféré est {{ row.item.skill }}.
					</template>
				</b-table>
			</div>
		</div>

		<b-modal size="lg" :id="addModal.id" :title="addModal.title" :hide-footer="true">
			<character-form @change="refreshArray" />
		</b-modal>

		<b-modal size="lg" :id="editModal.id" :title="editModal.title" :hide-footer="true">
			<character-form :charValues="editModal.item" @change="refreshArray" />
		</b-modal>

		<b-modal size="lg" :id="deleteModal.id" :title="deleteModal.title">
			<p class="my-2">Etes-vous sur de vouloir supprimer ce personnage ?</p>
			<template v-slot:modal-footer>
				<b-button size="sm" variant="danger" @click="removeChar(deleteModal.item)">
					Supprimer le personnage
				</b-button>
				<b-button size="sm" variant="secondary" @click="$bvModal.hide(deleteModal.id)">
					Annuler
				</b-button>
			</template>
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

				addModal: {
					id: 'add-modal',
					title: ''
				},

				editModal: {
					id: 'edit-modal',
					title: '',
					item: '',
				},

				deleteModal: {
					id: 'delete-modal',
					title: '',
					item: '',
				}
			}
		},

		async created() {
			this.refreshArray()
		},

		methods: {
			edit(item, button) {
				this.editModal.title = `Modification du personnage ${item.pseudo}`
				this.editModal.item = item
				this.$root.$emit('bv::show::modal', this.editModal.id, button)
			},

			add(button) {
				this.addModal.title = "Ajout d'un personnage"
				this.$root.$emit('bv::show::modal', this.addModal.id, button)
			},

			remove(item, button) {
				console.log("coucou")
				this.deleteModal.title = `Suppression du personnage ${item.pseudo}`
				this.deleteModal.item = item
				this.$root.$emit('bv::show::modal', this.deleteModal.id, button)
			},

			async refreshArray() {
				this.$bvModal.hide(this.addModal.id)
				this.$bvModal.hide(this.editModal.id)
				this.$bvModal.hide(this.deleteModal.id)
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

			async removeChar(item) {
				await axios.delete(API_BASE_URL + '/characters/' + item.id)
				await this.refreshArray()
			},

			getJobColor(job) {
				switch(job) {
					case "Guerrier" : return 'warning'
					case "Mage" : return 'info'
					case "Prêtre" : return 'light'
					case "Chasseur" : return 'success'
					default: return 'secondary'
				}
			}
		},

		computed: {
			formatedItems() {
				return this.items.map(item => 
					Object.assign({}, item, {
						_cellVariants: {
							race : this.getJobColor(item.job),
							health: this.getJobColor(item.job),
							armor: this.getJobColor(item.job),
							detail: this.getJobColor(item.job),
							owner: this.getJobColor(item.job)
						}
					})
				)
			},
		},

		components: { CharacterForm }
	}
</script>
