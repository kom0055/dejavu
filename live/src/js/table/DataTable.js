const React = require("react");
const FeatureComponent = require("../features/FeatureComponent.js");
const PageLoading = require("./PageLoading.js");
const Info = require("./Info.js");
const Column = require("./Column.js");

const Pretty = FeatureComponent.Pretty;
const Cell = require("./Cell.js");
const Table = require("./Table.js");

// row/column manipulation functions.
// We decided to roll our own as existing
// libs with React.JS were missing critical
// features.
const cellWidth = "250px";

// This has the main properties that define the main data table
// i.e. the right side.
class DataTable extends React.Component {
	render() {
		const $this = this;
		const data = this.props._data;
		var fixed = [],
			columns,
			initial_final_cols;
		// If render from sort, dont change the order of columns
		if (!$this.props.sortInfo.active) {
			if ($this.props.infoObj.showing != 0) {
				fixed = ["json"];
				columns = ["json"];
				initial_final_cols = [{ column: "json", type: "" }];
			} else {
				fixed = [];
				columns = [];
				initial_final_cols = [];
			}

			fullColumns = {
				type: "",
				columns,
				final_cols: initial_final_cols
			};
			for (var each in data) {
				fullColumns.type = data[each]._type;
				for (const column in data[each]) {
					if (fixed.indexOf(column) <= -1 && column != "_id" && column != "_type" && column != "_checked") {
						if (fullColumns.columns.indexOf(column) <= -1) {
							fullColumns.columns.push(column);
							const obj = {
								type: data[each]._type,
								column
							};
							fullColumns.final_cols.push(obj);
						}
					}
				}
			}
		}
		const rows = [];
		var visibleColumns = [];
		var renderColumns = [];
		for (const row in data) {
			const newRow = {};
			var columns = fullColumns.columns;
			newRow.json = data[row].json;
			// newRow['_type'] = data[row]['_type'];
			// newRow['_id'] = data[row]['_id'];
			for (var each in columns) {
				// We check if every column of the new document
				// is present already, if not we appen to the
				// right.
				if (fixed.indexOf(columns[each]) <= -1) {
					if (data[row].hasOwnProperty([columns[each]])) {
						const cell = data[row][columns[each]];
						newRow[columns[each]] = cell;
					} else {
						// Just to make sure it doesn't display
						// a null.
						newRow[columns[each]] = "";
					}
				}
			}
			const renderRow = [];
			for (var each in newRow) {
				const _key = keyGen(data[row], each);
				const elem = document.getElementById(each);
				let visibility = "";

				// We see if the column is already closed of open
				// using the html key attribute and render their
				// visibility correspondingly.
				if (elem) {
					visibility = elem.style.display;
				}
				renderRow.push(<Cell
					item={newRow[each]}
					unique={_key}
					key={_key}
					columnName={each}
					_id={data[row]._id}
					_type={data[row]._type}
					visibility={visibility}
					row={newRow}
					_checked={newRow._checked}
					actionOnRecord={$this.props.actionOnRecord}
				/>);
			}
			rows.push({
				_key: String(data[row]._id) + String(data[row]._type),
				row: renderRow
			});
		}
		var renderColumns = fullColumns.final_cols.map(item => (<Column
			_item={item.column} key={item.column}
			_type={item.type}
			_sortInfo={$this.props.sortInfo}
			handleSort={$this.props.handleSort}
			mappingObj={$this.props.mappingObj}
			filterInfo={$this.props.filterInfo}
			externalQueryApplied={$this.props.externalQueryApplied}
		/>));
		var visibleColumns = this.props.visibleColumns;

		const renderRows1 = [];

		// //If render from sort, dont render the coumns
		const renderRows = rows.map((item, key) => {
			const _key = item._key;
			const row = item.row;
			return (<tr id={_key} key={_key}>
				{row}
			</tr>);
		});

		// Extra add btn
		let extraAddBtn = "";
		// Show only when total records are less than 5
		if (this.props.infoObj.availableTotal <= 5) {
			extraAddBtn = (<div className="AddExtraBtn">
				<FeatureComponent.AddDocument
					types={this.props.Types}
					addRecord={this.props.addRecord}
					getTypeDoc={this.props.getTypeDoc}
					userTouchAdd={this.props.infoObj.userTouchAdd}
					link="true"
					text="&nbsp;&nbsp;Add Data"
					selectClass="tags-select-big"
				/>
			</div>);
		}

		// Page loading - show while paging
		const pageLoadingComponent = this.props.pageLoading ?
			(<PageLoading
				key="123"
				visibleColumns={visibleColumns}
				pageLoading={this.props.pageLoading}
			/>) : "";

		return (
			<div className="dejavu-table">

				<Info
					infoObj={this.props.infoObj}
					totalRecord={this.props.totalRecord}
					filterInfo={this.props.filterInfo}
					removeFilter={this.props.removeFilter}
					removeSort={this.props.removeSort}
					removeTypes={this.props.removeTypes}
					removeHidden={this.props.removeHidden}
					types={this.props.Types}
					addRecord={this.props.addRecord}
					getTypeDoc={this.props.getTypeDoc}
					sortInfo={this.props.sortInfo}
					columns={columns}
					visibleColumns={visibleColumns}
					hiddenColumns={this.props.hiddenColumns}
					columnToggle={this.props.columnToggle}
					actionOnRecord={this.props.actionOnRecord}
					reloadData={this.props.reloadData}
					exportJsonData={this.props.exportJsonData}
					selectedTypes={this.props.selectedTypes}
					externalQueryApplied={this.props.externalQueryApplied}
					externalQueryTotal={this.props.externalQueryTotal}
					removeExternalQuery={this.props.removeExternalQuery}
					dejavuExportData={this.props.dejavuExportData}
				/>

				{extraAddBtn}

				<div className="outsideTable">
					<Table
						renderColumns={renderColumns}
						visibleColumns={visibleColumns}
						renderRows={renderRows}
						scrollFunction={this.props.scrollFunction}
						selectedTypes={this.props.selectedTypes}
						filterInfo={this.props.filterInfo}
					/>
				</div>
				{pageLoadingComponent}
				<input id="copyId" className="hide" />
			</div>
		);
	}
}

module.exports = DataTable;
