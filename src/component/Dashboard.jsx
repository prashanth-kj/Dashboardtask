import React, { useState } from 'react'
import { useContext } from 'react'
import {DashboardDataContext} from '../component/context/DashboardContext'
import Form from 'react-bootstrap/Form';
import TripTile from './TripTile';
import CompilanceTile from './CompilanceTile';
import DistanceTile from './DistanceTile';
import FleetTile from './FleetTile';
import Tripdistace from './Tripdistace';
import AssetTile from './AssetTile';

function Dashboard() {
   
    let [startdate,setStartDate]=useState(null)
    let [enddate,setEndDate]=useState(null)

    let {dashboardData} =useContext(DashboardDataContext)
    console.log(dashboardData)



  return <>
     <div className='container mt-5'>
         <div className='text-center'>
              <h3>Dashboard</h3>
         </div>
        <div className='row'>
              <div className='col'>
                  <div className='row'>
                       <FleetTile startdate={startdate} enddate={enddate}/>
                  </div>
                  <div className='row'>
                     <h4>Scheduled Trip Start And End time</h4>
                        <div className='col'>
                        <Form>  
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Control type="date"  onChange={(e)=>setStartDate(e.target.value)}/>
                            </Form.Group>
                        </Form>
                        </div>
                         
                         <div className='col'>
                            <Form>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Control type="date" onChange={(e)=>setEndDate(e.target.value)}/>
                                </Form.Group>  
                            </Form>
                         </div>
                        
                  </div>
                  <div className='row shadow'>
                       <TripTile startdate={startdate} enddate={enddate}/>
                  </div>
              </div>
              <div className='col p-5'>
                    <CompilanceTile startdate={startdate} enddate={enddate}/>
              </div>
              <div className='col p-4'>
                    <DistanceTile startdate={startdate} enddate={enddate}/>
              </div>
        </div> 

        <div className='row'>
             <div className='col'>
                <Tripdistace startdate={startdate} enddate={enddate}/>
             </div>
             <div className='col'>
                 <AssetTile startdate={startdate} enddate={enddate}/>
             </div>
        </div> 

     </div>
  
  
  </>
}

export default Dashboard