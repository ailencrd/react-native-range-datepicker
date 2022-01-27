'use strict'
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import Month from './Month';
import moment from 'moment';
moment.locale('es');

export default class RangeDatepicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startDate: props.startDate && moment(props.startDate, 'YYYYMMDD'),
			untilDate: props.untilDate && moment(props.untilDate, 'YYYYMMDD'),
			availableDates: props.availableDates || null
		}

		this.onSelectDate = this.onSelectDate.bind(this);
		this.onReset = this.onReset.bind(this);
		this.handleConfirmDate = this.handleConfirmDate.bind(this);
		this.handleRenderRow = this.handleRenderRow.bind(this);
	}

	static defaultProps = {
		initialMonth: '',
		dayHeadings: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
		maxMonth: 12,
		buttonColor: 'green',
		buttonContainerStyle: {},
		showReset: true,
		showClose: true,
		ignoreMinDate: false,
    isHistorical: false,
		onClose: () => {},
		onSelect: () => {},
		onConfirm: () => {},
		placeHolderStart: 'Start Date',
		placeHolderUntil: 'Until Date',
		selectedBackgroundColor: 'green',
		selectedTextColor: 'white',
		todayColor: 'green',
		startDate: '',
		untilDate: '',
		minDate: '',
		maxDate: '',
		infoText: '',
		infoStyle: {color: '#fff', fontSize: 10},
		infoContainerStyle: {
			marginRight: 20, 
			paddingHorizontal: 20, 
			paddingVertical: 5,   
			elevation: 1,
			borderRadius: 4,
			backgroundColor: '#00aeef', alignSelf: 'flex-end'},
			showSelectionInfo: true,
		showButton: true,
	};


	static propTypes = {
		initialMonth: PropTypes.string,
		dayHeadings: PropTypes.arrayOf(PropTypes.string),
		availableDates: PropTypes.arrayOf(PropTypes.string),
		maxMonth: PropTypes.number,
		buttonColor: PropTypes.string,
		buttonContainerStyle: PropTypes.object,
		startDate: PropTypes.string,
		untilDate: PropTypes.string,
		minDate: PropTypes.string,
		maxDate: PropTypes.string,
		showReset: PropTypes.bool,
		showClose: PropTypes.bool,
		ignoreMinDate: PropTypes.bool,
    isHistorical: PropTypes.bool,
		onClose: PropTypes.func,
		onSelect: PropTypes.func,
		onConfirm: PropTypes.func,
		placeHolderStart: PropTypes.string,
		placeHolderUntil: PropTypes.string,
		selectedBackgroundColor: PropTypes.string,
		selectedTextColor: PropTypes.string,
		todayColor: PropTypes.string,
		infoText: PropTypes.string,
		infoStyle: PropTypes.object,
		infoContainerStyle: PropTypes.object,
		showSelectionInfo: PropTypes.bool,
		showButton: PropTypes.bool,
	}

	componentWillReceiveProps(nextProps) {
		this.setState({availableDates: nextProps.availableDates});
	}

	onSelectDate(date){
		let startDate = null;
		let untilDate = null;
		const { availableDates } = this.state;

		if(this.state.startDate && !this.state.untilDate)
		{
			if(date.format('YYYYMMDD') < this.state.startDate.format('YYYYMMDD') || this.isInvalidRange(date)){
				startDate = date;
			}
			else if(date.format('YYYYMMDD') > this.state.startDate.format('YYYYMMDD')){
				startDate = this.state.startDate;
				untilDate = date;
			}
			else{
				startDate = null;
				untilDate = null;
			}
		}
		else if(!this.isInvalidRange(date)) {
			startDate = date;
		}
		else {
			startDate = null;
			untilDate = null;
		}

		this.setState({startDate, untilDate});
		this.props.onSelect(startDate, untilDate);
	}

	isInvalidRange(date) {
		const { startDate, untilDate, availableDates } = this.state;

		if(availableDates && availableDates.length > 0){
			//select endDate condition
			if(startDate && !untilDate) {
				for(let i = startDate.format('YYYYMMDD'); i <= date.format('YYYYMMDD'); i = moment(i, 'YYYYMMDD').add(1, 'days').format('YYYYMMDD')){
					if(availableDates.indexOf(i) == -1 && startDate.format('YYYYMMDD') != i)
						return true;
				}
			}
			//select startDate condition
			else if(availableDates.indexOf(date.format('YYYYMMDD')) == -1)
				return true;
		}

		return false;
	}

	getMonthStack(){
		let res = [];
		const { maxMonth, initialMonth, isHistorical } = this.props;
		let initMonth = moment();
		if(initialMonth && initialMonth != '')
			initMonth = moment(initialMonth, 'YYYYMM');

		for(let i = 0; i < maxMonth; i++){
			res.push(
        !isHistorical ? (
          initMonth.clone().add(i, 'month').format('YYYYMM')
        ) : (
          initMonth.clone().subtract(i, 'month').format('YYYYMM')
        )
      );
		}

		return res;
	}

	onReset(){
		this.setState({
			startDate: null,
			untilDate: null,
		});

		this.props.onSelect(null, null);
	}

	handleConfirmDate(){
		this.props.onConfirm && this.props.onConfirm(this.state.startDate,this.state.untilDate);
	}

	handleRenderRow(month, index) {
		const { selectedBackgroundColor, selectedTextColor, todayColor, ignoreMinDate, minDate, maxDate } = this.props;
		let { availableDates, startDate, untilDate } = this.state;



		if(availableDates && availableDates.length > 0){
			availableDates = availableDates.filter(function(d){
				if(d.indexOf(month) >= 0)
					return true;
			});
		}

		return (
			<Month
				onSelectDate={this.onSelectDate}
				startDate={startDate}
				untilDate={untilDate}
				availableDates={availableDates}
				minDate={minDate ? moment(minDate, 'YYYYMMDD') : minDate}
				maxDate={maxDate ? moment(maxDate, 'YYYYMMDD') : maxDate}
				ignoreMinDate={ignoreMinDate}
				dayProps={{selectedBackgroundColor, selectedTextColor, todayColor}}
				month={month} />
		)
	}

	render(){
			return (
				<View style={{backgroundColor: '#ffffff', zIndex: 1000, alignSelf: 'center', width: '100%', flex: 1}}>
					{
						this.props.showClose || this.props.showReset ?
							(<View style={{ flexDirection: 'row', justifyContent: "space-between", padding: 20, paddingBottom: 10}}>
								{
									this.props.showReset && <Text style={{fontSize: 16}} onPress={this.onReset}>Reestablecer</Text>
								}
								{
									this.props.showClose && <Text style={{fontSize: 16}} onPress={this.props.onClose}>Cerrar</Text>
								}
							</View>)
							:
							null
					}
					{
						this.props.showSelectionInfo ? 
						(
						<View style={{ flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 5, alignItems: 'center'}}>
							<View style={{flex: 1}}>
								<Text style={{fontSize: 34, color: '#666'}}>
									{ this.state.startDate ? moment(this.state.startDate).format("MMM DD YYYY") : this.props.placeHolderStart}
								</Text>
							</View>

							<View style={{}}>
								<Text style={{fontSize: 80}}>
									/
								</Text>
							</View>

							<View style={{flex: 1}}>
								<Text style={{fontSize: 34, color: '#666', textAlign: 'right'}}>
									{ this.state.untilDate ? moment(this.state.untilDate).format("MMM DD YYYY") : this.props.placeHolderUntil}
								</Text>
							</View>
						</View>
						) : null
					}
					
					{
						this.props.infoText != "" &&
						<View style={this.props.infoContainerStyle}>
							<Text style={this.props.infoStyle}>{this.props.infoText}</Text>
						</View>
					}
					<View style={styles.dayHeader}>
						{
							this.props.dayHeadings.map((day, i) => {
								return (<Text style={{width: "14%", textAlign: 'center', fontSize: 10}} key={i}>{day}</Text>)
							})
						}
					</View>
					<FlatList
						style={{ flex: 1 }}
			            data={this.getMonthStack()}
			            renderItem={ ({item, index}) => { 
							return this.handleRenderRow(item, index)
						}}
						keyExtractor = { (item, index) => index.toString() }
			            showsVerticalScrollIndicator={false}
					/>

					{
						this.props.showButton ? 
						(
						<View style={[styles.buttonWrapper, this.props.buttonContainerStyle]}>
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={this.handleConfirmDate}
								style={styles.buttonStyle}
								>
							<Text style={styles.buttonText}>Seleccionar</Text>
							</TouchableOpacity>
							{/* <Button
								title="Seleccionar" 
								onPress={this.handleConfirmDate}
								style={styles.buttonStyle}
								color={this.props.buttonColor} /> */}
						</View>
						) : null
					}	
				</View>
			)
	}
}

const styles = StyleSheet.create({
	dayHeader : {
		flexDirection: 'row',
		paddingVertical: 10,
		paddingHorizontal: 10,
		borderRadius: 4,
		backgroundColor: '#b1b1b1'
	},
	buttonWrapper : {
		paddingVertical: 20,
		paddingHorizontal: 15,
		backgroundColor: '#ffffff',
		alignItems: 'flex-end'
	},
	buttonStyle: {
		elevation: 1,
		borderRadius: 4,
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#0097d0',	
		padding: 6,	
	},
	buttonText: {
		textAlign: 'center',
		fontWeight: '500',
		color: '#0097d0',	  
	}
});
