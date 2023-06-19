import { LeftCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Badge, Button } from 'react-bootstrap';
import config from '../../../../../config';
import Cookies from 'js-cookie';
import Holder from 'holderjs';
import { Spin, message } from 'antd';
import Datatable from '../../../../Components/Datatable';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [land, setLand] = useState(null);
  const [availableWorkers, setAvailableWorkers] = useState([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingWorkReport, setLoadingWorkReport] = useState(true);
  const [workReports, setWorkReports] = useState([]);

  useEffect(() => {
    fetchProject();
    fetchSentWorkOffers();
    fetchWorkReports();
    Holder.run();
  }, []);

  const headers = [
    {
      prop: "worker",
      title: "Worker",
      cell: (row) => (
        <div>
          <img
            src="https://placehold.co/50x50"
            alt="Placeholder"
            style={{ width: '50px', height: '50px', marginRight: '10px' }}
          />
          {row.worker.name}
        </div>
      )
    },
    {
      prop: "week",
      title: "Week",
      isFilterable: true,
      isSortable: true
    },
    {
      prop: "description",
      title: "Description"
    },
    {
      prop: "proof",
      title: "Proof",
      cell: (row) => (
        <a href={`//${row.proof}`} target="_blank" rel="noopener noreferrer">
          View Proof
        </a>
      )
    },
    {
      prop: "status",
      title: "Status",
      cell: (row) => (
        <>
          {row.status === "PENDING" ? (
            <>
              <Button variant="success" className='me-2' onClick={() => verifyReport(row.id, "ACCEPTED")}>Accept</Button>
              <Button variant="danger" onClick={() => verifyReport(row.id, "REJECTED")}>Reject</Button>
            </>
          ) : (
            <>
              <Badge bg={row.status === "ACCEPTED" ? "success" : "danger"}>
                {row.status}
              </Badge>
              <br />
              <Button variant="primary" onClick={() => verifyReport(row.id, "PENDING")}>Reset</Button>
            </>
          )}
        </>
      )
    }
  ];

  const fetchProject = async () => {
    try {
      setLoadingProject(true);

      const response = await fetch(`${config.api.projectService}/projects/${id}`, {
        method: 'GET',
        headers: {
          Authorization: "Bearer " + Cookies.get('token'),
          'Content-Type': 'application/json'
        }
      });
      const projectData = await response.json();

      if (projectData) {
        setProject(projectData);
        const landResponse = await fetch(`${config.api.landService}/lands/${projectData.landId}`, {
          method: 'GET',
          headers: {
            Authorization: "Bearer " + Cookies.get('token'),
            'Content-Type': 'application/json'
          }
        });
        const landData = await landResponse.json();
        setLand(landData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProject(false);
    }
  };

  const fetchSentWorkOffers = async () => {
    try {
      const response = await fetch(
        `${config.api.workerService}/admin/work-offers?filter[projectId]=${id}&filter[status]=ACCEPTED&filter[workContractAccepted]=1`
        , {
          method: 'GET',
          headers: {
            Authorization: "Bearer " + Cookies.get('token'),
            'Content-Type': 'application/json'
          }
        });
      const data = await response.json();
      setAvailableWorkers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWorkReports = async () => {
    try {
      setLoadingWorkReport(true);
      const response = await fetch(
        `${config.api.workerService}/admin/work-reports?filter[projectId]=${id}&include=worker`
        , {
          method: 'GET',
          headers: {
            Authorization: "Bearer " + Cookies.get('token'),
            'Content-Type': 'application/json'
          }
        });
      const data = await response.json();
      setWorkReports(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingWorkReport(false);
    }
  };

  const verifyReport = async (id, status) => {
    try {
      const response = await fetch(`${config.api.workerService}/admin/work-reports/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: "Bearer " + Cookies.get('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status
        })
      });
      
      if (response.ok) {
        if (status === "PENDING") {
          message.success("Work report status has been reset");
        } else {
          message.success("Work report has been verified");
        }
        fetchWorkReports();
      } else {
        const responseBody = await response.json();
        message.error(`Failed to change work offer status: ${responseBody}`);
      }
  
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Card>
        <Link to="/admin/projects/ongoing" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <LeftCircleOutlined style={{ marginRight: '5px' }} />
          <span>Back to Projects</span>
        </Link>
        <Card.Body>
          {loadingProject ? (
            <Spin />
          ) : (
            project && land && (
              <>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src="https://placehold.co/600x400"
                    alt="Placeholder"
                    style={{ marginRight: '10px', maxWidth: '300px', maxHeight: '300px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <Card.Title>{land.street}, {land.city}</Card.Title>
                    <Card.Text>
                      <strong>Status:</strong> {project.status}<br />
                      <strong>Worker Needs:</strong> {project.workerNeeds}<br />
                      <strong>Description:</strong> {project.description}<br />
                    </Card.Text>
                  </div>
                </div>
              </>
            )
          )}
        </Card.Body>

        <Card.Footer>
          {loadingWorkReport ? (
            <Spin />
          ) : (
            <>
              <strong>Work Progress:</strong>
              <Datatable data={workReports} headers={headers} />
            </>
          )}
        </Card.Footer>
      </Card>
    </>
  );
};

export default ProjectDetail;
