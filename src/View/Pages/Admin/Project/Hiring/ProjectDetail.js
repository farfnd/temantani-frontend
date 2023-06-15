import { LeftCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Button, Col, Row, Table, Badge } from 'react-bootstrap';
import config from '../../../../../config';
import Cookies from 'js-cookie';
import { Spin, message, Modal } from 'antd';
import $ from 'jquery';
import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader
} from 'react-bs-datatable';
import Datatable from '../../../../Components/Datatable';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [land, setLand] = useState(null);
  const [availableWorkers, setAvailableWorkers] = useState([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingWorker, setLoadingWorker] = useState(true);
  const [sentWorkOffers, setSentWorkOffers] = useState([]);
  const [loadingOffer, setLoadingOffer] = useState(false);

  useEffect(() => {
    fetchProject();
    fetchAvailableWorkers();
    fetchSentWorkOffers();
  }, []);

  const { confirm } = Modal;

  // Create table headers consisting of 4 columns.
  const headers = [
    {
      prop: "name",
      title: "Name",
      isFilterable: true,
      isSortable: true,
      cell: (row) => (
        <div>
          <img
            src="https://placehold.co/50x50"
            alt="Placeholder"
            style={{ width: '50px', height: '50px', marginRight: '10px' }}
          />
          {row.name}
        </div>
      )
    },
    {
      prop: "email",
      title: "Email"
    },
    {
      prop: "button",
      title: "Action",
      cell: (row) => (
        <div>
          {!isOfferSent(row.id) ? (
            <Button
              onClick={() => sendWorkOffer(row.id)}
              loading={loadingOffer}
              disabled={loadingOffer}
            >
              Send Work Offer
            </Button>
          ) : (
            <>
              {['PENDING', 'ACCEPTED', 'REJECTED'].includes(getWorkOfferStatus(row.id)) && (
                <>
                  {getWorkOfferStatus(row.id) === 'PENDING' ? (
                    <Button className='button-sm' onClick={() => cancelWorkOffer(row.id)} variant='danger'>Cancel Work Offer</Button>
                  ) : (
                    <Badge bg={getWorkOfferStatus(row.id) === 'ACCEPTED' ? 'success' : 'danger'}>
                      {getWorkOfferStatus(row.id)}
                    </Badge>
                  )}
                </>
              )}

            </>
          )}
        </div>
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

  const fetchAvailableWorkers = async () => {
    try {
      setLoadingWorker(true);
      const response = await fetch(`${config.api.workerService}/admin/workers?filter[workAvailability]=AVAILABLE`, {
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
    } finally {
      setLoadingWorker(false);
    }
  };

  const fetchSentWorkOffers = async () => {
    try {
      const response = await fetch(`${config.api.workerService}/admin/work-offers?filter[projectId]=${id}`, {
        method: 'GET',
        headers: {
          Authorization: "Bearer " + Cookies.get('token'),
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setSentWorkOffers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const isOfferSent = (workerId) => {
    return sentWorkOffers.some((offer) => offer.workerId === workerId);
  };

  const getWorkOfferStatus = (workerId) => {
    const offer = sentWorkOffers.find((offer) => offer.workerId === workerId);
    return offer ? offer.status : '';
  };
  const sendWorkOffer = async (workerId) => {
    setLoadingOffer(true);
    try {
      const requestBody = {
        projectId: id,
        workerId: workerId,
        status: 'PENDING'
      };

      const response = await fetch(`${config.api.workerService}/admin/work-offers`, {
        method: 'POST',
        headers: {
          Authorization: "Bearer " + Cookies.get('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        setLoadingOffer(false);
        fetchSentWorkOffers();
        message.success('Work offer sent!');
      } else {
        const responseBody = await response.json();
        message.error(`Failed to send work offer: ${responseBody}`);
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to send work offer: ' + error);
    }
  };

  const cancelWorkOffer = (workerId) => {
    confirm({
      title: 'Are you sure you want to cancel the work offer?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          const offer = sentWorkOffers.find((offer) => offer.workerId === workerId);
          if (!offer) {
            message.error('Work offer not found');
            return;
          }
          const offerId = offer.id;

          const response = await fetch(`${config.api.workerService}/admin/work-offers/${offerId}`, {
            method: 'DELETE',
            headers: {
              Authorization: "Bearer " + Cookies.get('token'),
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            message.success('Work offer canceled!');
            fetchSentWorkOffers(); // Refresh the sent work offers list
          } else {
            const responseBody = await response.json();
            message.error(`Failed to cancel work offer: ${responseBody}`);
          }
        } catch (error) {
          console.error(error);
          message.error('Failed to cancel work offer: ' + error);
        }
      }
    });
  };

  return (
    <>
      <Card>
        <Link to="/admin/projects/hiring" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
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
          {loadingWorker ? (
            <Spin />
          ) : (
            <>
              <strong>Available Workers:</strong>
              <Datatable data={availableWorkers} headers={headers} />
            </>
          )}
        </Card.Footer>
      </Card>
    </>
  );
};

export default ProjectDetail;