<template>
	<b-card>
		<b-tabs>
			<b-tab title="Dashboard">
				<div>
					<div v-if="isLoading">Chargement des personnages...</div>
					<div v-else>
						<b-table hover :items="items" :fields="fields">
						</b-table>
					</div>
				</div>
			</b-tab>
			<b-tab title="Ajouter un personnage">
				Contents 2
			</b-tab>
		</b-tabs>
	</b-card>
</template>

<script>
	import axios from 'axios'
	import { API_BASE_URL } from '../config'

	export default {
		data() {
			return {
				isLoading: true,
				fields: [
					{ key: 'pseudo', label: 'Pseudo', sortable: true },
					{ key: 'race', label: 'Race', sortable: true },
					{ key: 'health', label: 'Points de vie', sortable: true },
					{ key: 'armor', label: 'Armure', sortable: false },
					{ key: 'detail', label: 'Détails', sortable: false },
					{ key: 'owner', label: 'Propriétaire', sortable: true }
				],
				items: []
			}
		},

		async created() {
			try {
				const response = await axios.get(API_BASE_URL + '/characters')
				this.items = response.data.data
				this.isLoading = false
			}
			catch(e) {
				alert("fail");
			}
		}
	}
</script>